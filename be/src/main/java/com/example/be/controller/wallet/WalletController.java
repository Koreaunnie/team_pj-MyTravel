package com.example.be.controller.wallet;

import com.example.be.dto.wallet.Wallet;
import com.example.be.service.member.MemberService;
import com.example.be.service.wallet.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wallet")
public class WalletController {
    final WalletService service;
    final MemberService memberService;

    // 내 지갑 지출 / 수입 추가
    @PostMapping("add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> add(@RequestBody Wallet wallet,
                                                   Authentication authentication) {

        wallet.setWriter(authentication.getName());

        if (service.add(wallet)) {
            // 성공
            return ResponseEntity.ok(Map.of("message", Map.of(
                    "type", "success", "text", "내역이 저장되었습니다")));
        } else {
            // 실패
            return ResponseEntity.badRequest().body(Map.of("message", Map.of(
                    "type", "warning", "text", "정확한 정보를 입력해주세요")));
        }

    }

    // 내 지갑 내역 보기
    @GetMapping("list")
    @PreAuthorize("isAuthenticated()")
    public List<Wallet> list(Authentication authentication) {
        return service.list(authentication);
    }

    // 내 지갑 내역 상세 보기
    @GetMapping("view/{id}")
    @PreAuthorize("isAuthenticated()")
    public Wallet view(@PathVariable int id,
                       Authentication authentication) {
        return service.view(id, authentication);
    }

    // 내 지갑 내역 상세 보기 화면에서 수정
    @PutMapping("update/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> update(@PathVariable int id, @RequestBody Wallet wallet) {
        boolean isUpdated = service.update(id, wallet);

        if (isUpdated) {
            // 성공
            return ResponseEntity.ok(Map.of("message", Map.of(
                    "type", "success", "text", "수정되었습니다")));
        } else {
            // 실패
            return ResponseEntity.badRequest().body(Map.of("message", Map.of(
                    "type", "warning", "text", "정확한 정보를 입력해주세요")));
        }
    }

    // 내 지갑 내역 삭제
    @DeleteMapping("delete/{id}")
    @PreAuthorize("isAuthenticated()")
    public void delete(@PathVariable int id,
                       Authentication authentication) {
        service.delete(id, authentication);
    }

    // 내 지갑 내용 추가 / 수정 시 카테고리 목록 반환
    @GetMapping("categories")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = service.getCategories();
        return ResponseEntity.ok(categories);
    }
}
