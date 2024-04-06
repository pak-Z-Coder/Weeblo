import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppContext } from "@/context/page"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
const EditForm = ({ setOpen }) => {
    let { user, setUser } = useAppContext();
    const [loading, setLoading] = useState(null)
    const [editError, setEditError] = useState(null);
    const editSchema = z.object({
        username: z.string().min(3, {
            message: "Username must be at least 3 characters.",
        }).max(20, {
            message: "Username must be less than 20 characters.",
        }),
        password: z.string().min(6, {
            message: "Password must be at least 6 characters.",
        }),
        password_confirm: z.string().min(6)
    }).refine((data) => data.password === data.password_confirm, {
        message: "Passwords don't match",
        path: ["password_confirm"],
    });
    const form = useForm({
        resolver: zodResolver(editSchema),
        defaultValues: {
            username: user && user.username,
            password: user && user.password,
        },
    });

    const handleEditSubmit = async (editData) => {
        try {
            setLoading(true)
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, username: editData.username, password: editData.password }),
            })
            const data = await response.json()
            if (data.status != 201) {
                setLoading(false)
                return setEditError([{ message: data.body.message }]);
            }
            setUser(data.body.user)
            setEditError(false);
            setLoading(false)
            setOpen(false)
        } catch (error) {
            setEditError(error.message);
            setLoading(false)
        }
    };
    return (
        <Card className="mx-auto max-w-sm border-none">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Edit</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleEditSubmit)}>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="weeb" {...field} id="username" name="username" type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="password" {...field} id="password" name="password" type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password_confirm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input autoComplete="new-password" placeholder="Confirm password" {...field} id="password_confirm" name="password_confirm" type="password" />
                                    </FormControl>
                                    <FormDescription>
                                        Always remember your password
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={loading} className="w-full mt-2 flex items-center space-x-6" type="submit">
                            <p>Edit</p> {loading && <Loader2 className="animate-spin " />}
                        </Button>
                    </form>
                </Form>
                {editError && <div className="mt-1 text-red-500">{
                    <p className="text-xs">{editError}</p>
                }</div>}
            </CardContent>
        </Card>
    );
}

export default EditForm