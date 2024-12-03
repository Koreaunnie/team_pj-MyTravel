package com.example.be.controller.wallet;

import com.example.be.dto.wallet.Wallet;
import com.example.be.service.wallet.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wallet")
public class WalletController {
    final WalletService service;

    // 내 지갑 지출 / 수입 추가
    @PostMapping("add")
    public ResponseEntity<Map<String, Object>> add(@RequestBody Wallet wallet) {

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
    public List<Wallet> list() {
        return service.list();
    }

    // 내 지갑 내역 상세 보기
    @GetMapping("view/{id}")
    public Wallet view(@PathVariable int id) {
        return service.view(id);
    }

    // 내 지갑 내역 상세 보기 화면에서 수정
    @PutMapping("update/{id}")
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
    public void delete(@PathVariable int id) {
        service.delete(id);
    }
}
