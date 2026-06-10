package com.AEP2B.utils;

import java.util.Random;

public class GeradorProtocolo {

  private static final String CARACTERES =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  private static final Random RANDOM = new Random();

  public static String gerar(int tamanho) {

    StringBuilder sb = new StringBuilder();

    for (int i = 0; i < tamanho; i++) {
      sb.append(
          CARACTERES.charAt(
              RANDOM.nextInt(CARACTERES.length())
          )
      );
    }

    return sb.toString();
  }
}
