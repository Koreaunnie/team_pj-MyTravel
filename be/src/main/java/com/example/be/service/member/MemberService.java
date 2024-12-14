package com.example.be.service.member;

import com.example.be.dto.member.Member;
import com.example.be.dto.member.MemberEdit;
import com.example.be.dto.member.MemberPicture;
import com.example.be.mapper.community.CommunityMapper;
import com.example.be.mapper.member.MemberMapper;
import com.example.be.mapper.tour.TourMapper;
import com.example.be.service.tour.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {
    final MemberMapper mapper;
    final S3Client s3;
    final JwtEncoder jwtEncoder;

    private final TourService tourService;
    private final TourMapper tourMapper;
    private final MemberMapper memberMapper;
    private final CommunityMapper communityMapper;

    @Value("${image.src.prefix}")
    String imageSrcPrefix;

    @Value("${bucket.name}")
    String bucketName;

    public boolean add(Member member, MultipartFile[] files) {
        int cnt = mapper.insert(member);

        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                mapper.updatePicture(member.getEmail(), file.getOriginalFilename());

                String objectKey = "teamPrj1126/member/" + member.getEmail() + "/" + file.getOriginalFilename();
                PutObjectRequest por = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(objectKey)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();
                try {
                    s3.putObject(por, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        }

        return cnt == 1;
    }

    public boolean checkEmail(String email) {
        return mapper.selectByEmail(email) != null;
    }

    public List<Member> list() {
        return mapper.selectAll();
    }

    public Member get(String email) {
        Member member = mapper.selectByEmail(email);
        String profileName = mapper.selectPictureByEmail(email);

        if (profileName != null) {
            MemberPicture PicSrc = new MemberPicture(
                    profileName, imageSrcPrefix + "/member/" + email + "/" + profileName);
            member.setProfile(List.of(PicSrc));
        } else {
            member.setProfile(Collections.emptyList());
        }

        return member;
    }

    public boolean remove(Member member) {
        int cnt = 0;

        Member db = mapper.selectByEmail(member.getEmail());
        if (db != null && db.getPassword().equals(member.getPassword())) {
            //게시글은 on delete set null 설정으로 변경함: 목록 찾아 tour id 알아내고 탈퇴 후 null된 tour를 탈퇴한 사용자
            //쓴 게시물 목록
            List<Integer> tourBoards = tourMapper.selectByPartner(db.getNickname());
//      //게시물 삭제가 아니라 active false로
            for (Integer tourId : tourBoards) {
                tourService.delete(tourId);
            }

            //권한 삭제 (auth)
            mapper.deleteAuthByEmail(member.getEmail());


            //프로필 사진 삭제
            String profile = mapper.selectPictureByEmail(db.getEmail());
            String key = "teamPrj1126/member/" + member.getEmail() + "/" + profile;
            DeleteObjectRequest dor = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3.deleteObject(dor);

            //멤버의 장바구니 삭제
            mapper.deleteCartByMemberEmail(member.getEmail());


            //멤버의 구매 이력 관리
//      for (Integer tourBoard : tourBoards) {
//      }

            //tour partner와 partnerEmail 탈퇴한 회원으로 변경
            for (Integer tourId : tourBoards) {
                mapper.updatePartnerToLeft(tourId);
            }

            //community writer 탈퇴한 회원으로 변경
            List<Integer> wholeCommunityId = communityMapper.selectWholeCommunityIdByWriter(db.getNickname());
            for (Integer communityId : wholeCommunityId) {
                mapper.updateWriterToLeft(communityId);
            }

            //community_comment writer 탈퇴한 회원으로 변경
            List<Integer> wholeCommunityCommentId = communityMapper.selectWholeCommunityCommentIdByWriter(db.getNickname());
            for (Integer communityCommentId : wholeCommunityCommentId) {
                mapper.updateCommentWriterToLeft(communityCommentId);
            }

            //community_like person 제거하기
            List<Integer> wholeCommunityLike = communityMapper.selectWholeCommunityLikeByNickName(db.getNickname());
            for (Integer likeCommunityId : wholeCommunityLike) {
                communityMapper.deleteLikeByInformation(likeCommunityId, db.getNickname());
            }

            //member 삭제
            cnt = mapper.deleteByEmail(member.getEmail());

        }

        return cnt == 1;
    }

    public boolean update(MemberEdit member, MultipartFile uploadFiles) {
        int cnt = 0;

        //회원 조회 & 비번 대조
        Member db = mapper.selectByEmail(member.getEmail());
        if (db != null && db.getPassword().equals(member.getOldPassword())) {
            if (uploadFiles != null) {
                //s3기존 이미지 삭제
                String oldPicture = mapper.selectPictureByEmail(db.getEmail());
                String key = "teamPrj1126/member/" + member.getEmail() + "/" + oldPicture;
                DeleteObjectRequest dor = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();
                s3.deleteObject(dor);


                //member 테이블에 이미지 정보 수정
                mapper.updatePicture(member.getEmail(), uploadFiles.getOriginalFilename());

                //s3 이미지 업로드
                String objectKey = "teamPrj1126/member/" + member.getEmail() + "/" + uploadFiles.getOriginalFilename();
                PutObjectRequest por = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(objectKey)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                try {
                    s3.putObject(por, RequestBody.fromInputStream(uploadFiles.getInputStream(), uploadFiles.getSize()));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }

            cnt = mapper.update(member);
        }
        return cnt == 1;
    }

    public String token(Member member) {
        Member db = mapper.selectByEmail(member.getEmail());
        List<String> auths = mapper.selectAuthByMemberEmail(member.getEmail());
        String authsString = auths.stream()
                .collect(Collectors.joining(" "));

        //이메일에 해당하는 회원이 있다면.
        if (db != null) {
            if (db.getPassword().equals(member.getPassword())) {
                //token 생성
                JwtClaimsSet claims = JwtClaimsSet.builder()
                        .issuer("self")
                        .subject(member.getEmail())
                        .issuedAt(Instant.now())
                        .expiresAt(Instant.now().plusSeconds(60 * 60 * 24 * 7))
                        .claim("scope", authsString)
                        .claim("nickname", db.getNickname())
                        .build();
                return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
            }
        }

        return null;
    }


    public boolean checkNickname(String nickname) {
        return mapper.selectByNickname(nickname) != null;
    }

    public boolean hasAccess(String email, Authentication auth) {
        return email.equals(auth.getName());
    }

    public boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream().map(e -> e.toString())
                .anyMatch(s -> s.equals("SCOPE_admin"));
    }

    public boolean isPartner(Authentication auth) {
        return auth.getAuthorities().stream().map(e -> e.toString())
                .anyMatch(s -> s.equals("SCOPE_partner"));
    }

    public List<Member> partnerList() {
        return mapper.partnerList();
    }

    public String getNicknameByEmail(String email) {
        return memberMapper.selectNicknameByEmail(email);
    }
}
