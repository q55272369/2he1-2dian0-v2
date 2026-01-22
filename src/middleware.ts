import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 🛡️ 核心修复：绝对白名单
  // 只要路径不是以 /admin 开头，直接放行，绝不弹窗
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // --- Admin 区域鉴权 ---
  const basicAuth = req.headers.get('authorization')

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    try {
      const [user, pwd] = atob(authValue).split(':')
      const validUser = process.env.AUTH_USER || 'admin'
      const validPass = process.env.AUTH_PASS || '123456'

      if (user === validUser && pwd === validPass) {
        return NextResponse.next()
      }
    } catch (e) {
      // 忽略解析错误
    }
  }

  // 验证失败：Body 必须为 null
  return new NextResponse(null, {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}

export const config = {
  // 仅匹配 admin 相关路径
  matcher: ['/admin', '/admin/:path*'],
}