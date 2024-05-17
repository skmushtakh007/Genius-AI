"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("8c4e085c-b67c-4452-89f5-0350a79e9f4e");
  }, []);

  return null;
};