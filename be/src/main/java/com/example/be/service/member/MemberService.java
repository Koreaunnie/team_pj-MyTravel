package com.example.be.service.member;

import com.example.be.dto.member.Member;
import com.example.be.dto.member.MemberEdit;
import com.example.be.dto.member.MemberPicture;
import com.example.be.mapper.member.MemberMapper;
import com.example.be.mapper.tour.TourMapper;
import com.example.be.service.tour.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {
  final MemberMapper mapper;
  final S3Client s3;
  final JwtEncoder jwtEncoder;

  private final TourService tourService;
  private final TourMapper tourMapper;

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

      List<Integer> tourBoards = tourMapper.selectByPartner(db.getNickname());
      for (Integer tourId : tourBoards) {
        tourService.delete(tourId);
      }

      String profile = mapper.selectPictureByEmail(db.getEmail());
      System.out.println(profile);
      String key = "teamPrj1126/member/" + member.getEmail() + "/" + profile;
      DeleteObjectRequest dor = DeleteObjectRequest.builder()
              .bucket(bucketName)
              .key(key)
              .build();
      s3.deleteObject(dor);

      cnt = mapper.deleteByEmail(member.getEmail());
      
    }

    return cnt == 1;
  }

  public boolean update(MemberEdit member, MultipartFile[] uploadFiles) {
    if (uploadFiles != null && uploadFiles.length > 0) {
      for (MultipartFile image : uploadFiles) {
        mapper.updatePicture(member.getEmail(), image.getOriginalFilename());

        String objectKey = "teamPrj1126/member/" + member.getEmail() + "/" + image.getOriginalFilename();
        PutObjectRequest por = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();

        try {
          s3.putObject(por, RequestBody.fromInputStream(image.getInputStream(), image.getSize()));
        } catch (IOException e) {
          throw new RuntimeException(e);
        }
      }
    }

    int cnt = 0;
    Member db = mapper.selectByEmail(member.getEmail());
    if (db != null) {
      if (db.getPassword().equals(member.getOldPassword())) {
        cnt = mapper.update(member);

      }
    }
    return cnt == 1;
  }

  public String token(Member member) {
    Member db = mapper.selectByEmail(member.getEmail());
    if (db != null) {
      if (db.getPassword().equals(member.getPassword())) {
        //token 생성
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .subject(member.getEmail())
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(60 * 60 * 24 * 7))
                .build();
        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
      }
    }

    return null;
  }


  public boolean checkNickname(String nickname) {
    return mapper.selectByNickname(nickname) != null;
  }
}
