package com.example.be.dto.member;

import org.springframework.web.multipart.MultipartFile;

import java.io.*;

public class CustomMultipartFile implements MultipartFile {
  private byte[] input;
  private String kakaoImageSrc;

  public CustomMultipartFile(byte[] input, String kakaoImageSrc) {
    this.input = input;
    this.kakaoImageSrc = kakaoImageSrc;
  }

  @Override
  public String getName() {
    return null;
  }

  @Override
  public String getOriginalFilename() {
    return kakaoImageSrc;
  }

  @Override
  public String getContentType() {
    return null;
  }

  @Override
  public boolean isEmpty() {
    return input == null || input.length == 0;
  }

  @Override
  public long getSize() {
    return input.length;
  }

  @Override
  public byte[] getBytes() throws IOException {
    return input;
  }

  @Override
  public InputStream getInputStream() throws IOException {
    return new ByteArrayInputStream(input);
  }

  @Override
  public void transferTo(File dest) throws IOException, IllegalStateException {
    try (FileOutputStream fos = new FileOutputStream(dest)) {
      fos.write(input);
    }
  }
}
