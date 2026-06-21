import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "学术英文精读台",
  description: "面向政治学、公共管理与社会科学研究者的英文学术精读工作台"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
