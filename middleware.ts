import { clerkMiddleware, createRouteMatcher, auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute=createRouteMatcher([
    '/',
    '/sign-in',
    '/sign-up',
    '/home'
])

const isPublicApiRoute=createRouteMatcher([
    '/api/videos'
])
export default clerkMiddleware(async (auth,req)=>{
    const { userId } = await auth();
    const currentUrl=new URL(req.url)
    const isAccessingDashboard=currentUrl.pathname==='/home';
    const isApiRequest=currentUrl.pathname.startsWith('/api/')

    //islogged in but tring to acces signup signin
    if(userId && isPublicRoute(req) && !isAccessingDashboard){
        return NextResponse.redirect(new URL('/home',req.url))
    }

    //is not logged in
    if(!userId){
        if(!isPublicRoute(req) && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL('/sign-in',req.url))
        }

        if(isApiRequest && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL('/sign-in',req.url))
        }
    }
})

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ],
}