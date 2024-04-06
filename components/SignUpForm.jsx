import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { z } from 'zod';
import { usePathname, useRouter } from 'next/navigation'
import { useAppContext } from "@/context/page"
import { Loader2 } from "lucide-react"
const SignUpForm = () => {
    let { setUser } = useAppContext();
    const router = useRouter()
    const pathname = usePathname()
    const [signUpForm, setSignUpForm] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(null)
    const [signUpError, setSignUpError] = useState(null);
    const signUpSchema = z.object({
        username: z.string().min(3, {
            message: "Username must be at least 3 characters.",
        }).max(20, {
            message: "Username must be less than 20 characters.",
        }),
        email: z.string().email(),
        password: z.string().min(6, {
            message: "Password must be at least 6 characters.",
        }),
    });

    const handleSignUpChange = (e) => {
        setSignUpForm({ ...signUpForm, [e.target.name]: e.target.value });
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const validatedData = signUpSchema.parse(signUpForm);
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(validatedData),
            })
            const data = await response.json()
            if (data.status != 201) {
                setLoading(false)
                return setSignUpError([{ message: data.body.message }]);
            }
            setUser(data.body.user)
            localStorage.setItem('user', JSON.stringify({ user: data.body.user.email }));
            if (pathname == "/")
                router.push('/home')
            setSignUpError(false);
            setLoading(false)
        } catch (error) {
            setSignUpError(JSON.parse(error.message));
            setLoading(false)
        }
    };

    return (
        <Card className="mx-auto max-w-sm border-none">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
                <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSignUpSubmit}>
                    <div className="space-y-4">
                        <div className="">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" name="username" value={signUpForm.username} onChange={handleSignUpChange} placeholder="Weeb" required type="text" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" value={signUpForm.email} onChange={handleSignUpChange} placeholder="weeb@example.com" required type="email" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" value={signUpForm.password} onChange={handleSignUpChange} required type="password" />
                        </div>
                        <Button disabled={loading} className="w-full flex items-center space-x-6" type="submit">
                            <p>Sign Up</p> {loading && <Loader2 className="animate-spin " />}
                        </Button>
                    </div>
                </form>
                {signUpError && <div className="mt-1 text-red-500">{
                    signUpError?.map((e) =>
                        <p className="text-xs">{e.message}</p>
                    )
                }</div>}
            </CardContent>
        </Card>
    );
}

export default SignUpForm