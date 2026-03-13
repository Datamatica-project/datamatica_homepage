import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = "jonghyun1803@naver.com";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "DataMatica 문의 <onboarding@resend.dev>",
    to: TO_EMAIL,
    replyTo: email,
    subject: `[문의] ${name}님의 문의`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #121212;">새 문의가 도착했습니다</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px; background: #f6f7f9; font-weight: bold; width: 100px;">이름</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 12px; background: #f6f7f9; font-weight: bold;">이메일</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">
              <a href="mailto:${email}">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; background: #f6f7f9; font-weight: bold; vertical-align: top;">메시지</td>
            <td style="padding: 12px; white-space: pre-wrap;">${message}</td>
          </tr>
        </table>
      </div>
    `,
  });

  if (error) {
    return NextResponse.json({ error: "메일 전송에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
