import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { z } from 'zod';
import { usePathname, useRouter } from 'next/navigation'
import { useAppContext } from "@/context/page"
import { Loader2 } from "lucide-react"
const LoginForm = () => {
    let { setUser } = useAppContext();
    const router = useRouter()
    const pathname = usePathname()
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(null)
    const [loginError, setLoginError] = useState(null);
    const loginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6, {
            message: "Password must be at least 6 characters.",
        }),
    });

    const handleLoginChange = (e) => {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const validatedData = loginSchema.parse(loginForm);
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(validatedData),
            })
            const data = await response.json()
            if (data.status != 201) {
                setLoading(false)
                return setLoginError([{ message: data.body.message }]);
            }
            setUser(data.body.user)
            localStorage.setItem('user', JSON.stringify({ user: data.body.user.email }));
            if (pathname == "/")
                router.push('/home')
            setLoginError(false);
            setLoading(false)
        } catch (error) {
            setLoginError(JSON.parse(error.message));
            setLoading(false)

        }
    };
    return (
        <Card className="mx-auto max-w-sm border-none">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Login</CardTitle>
                <CardDescription>Enter your email below to login to your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLoginSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" value={loginForm.email} onChange={handleLoginChange} placeholder="m@example.com" required type="email" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link className="ml-auto inline-block text-sm underline" href="#">
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input id="password" name="password" value={loginForm.password} onChange={handleLoginChange} required type="password" />
                        </div>
                        <Button disabled={loading} className="w-full flex items-center space-x-6" type="submit">
                            <p>Login</p> {loading && <Loader2 className="animate-spin " />}
                        </Button>
                    </div>
                </form>
                {loginError && <div className="mt-1 text-red-500">{
                    loginError?.map((e) =>
                        <p className="text-xs">{e.message}</p>
                    )
                }</div>}
            </CardContent>
        </Card>
    );
}

export default LoginForm