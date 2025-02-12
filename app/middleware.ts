import { NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Supabaseクライアントを初期化
  const supabase = createMiddlewareSupabaseClient({ req, res });

  // セッション情報を取得
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // セッションが存在しない場合、ログインページにリダイレクト
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // JWTトークンからロールを確認（例: "admin"）
  const userRole = session.user.user_metadata.role;
  if (userRole !== "admin") {
    // ロールが "admin" ではない場合、トップページにリダイレクト
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}