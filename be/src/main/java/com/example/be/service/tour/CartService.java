package com.example.be.service.tour;

import com.example.be.dto.tour.TourList;
import com.example.be.mapper.tour.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CartService {
  final CartMapper mapper;

  @Value("${image.src.prefix}")
  String imageSrcPrefix;

  public List<TourList> list(Authentication auth) {
    List<TourList> cartList = mapper.selectAll(auth.getName());

    cartList.stream().forEach(cart -> {
      if (cart.getImage() != null) {
        cart.setSrc(imageSrcPrefix + "/" + cart.getId() + "/" + cart.getImage());
      }
    });

    return cartList;
  }
}
