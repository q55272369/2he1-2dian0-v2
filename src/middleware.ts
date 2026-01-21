import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1. 严格限制：只有 /admin 开头的路径才触发鉴权
  // 这样绝对不会影响 Blog 首页
  if (pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization')

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      // 解码 Base64
      const [user, pwd] = atob(authValue).split(':')

      // 比对 Vercel 环境变量
      const validUser = process.env.AUTH_USER || 'admin'
      const validPass = process.env.AUTH_PASS || '123456'

      if (user === validUser && pwd === validPass) {
        return NextResponse.next()
      }
    }

    // 2. 验证失败或未登录，弹出原生登录框
    return new NextResponse(null, {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    })
  }

  // 其他路径直接放行
  return NextResponse.next()
}

// 3. 配置匹配器，双重保险
export const config = {
  matcher: ['/admin/:path*', '/admin'],
}