"use client"
import * as z from "zod";
import axios from "axios";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Music } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormControl
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProModal } from "@/hooks/use-pro-model";
import toast from "react-hot-toast";





const MusicPage = () => {
    const proModal=useProModal();
    const router = useRouter();
    const [music, setMusic] = useState<string[]>();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setMusic(undefined);
            
            
            const response = await axios.post("/api/music",values)
            setMusic(response.data.audio);
          

            form.reset();
        }
        catch (error: any) {
            if(error?.response?.status === 403){
                proModal.onOpen();
            }
            else{
            toast.error("somthing went wront")
            }
        } finally {
            router.refresh();
        }
    }
    return (
        <div>
            <Heading
                title="Music Generation"
                description="Turn your prompt into music."
                icon={Music}
                iconColor="text-emrald-500"
                bgColor="bg-emrald-500/10"
            />
            <div className="px-4 lg:px-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid-cols-12 gap-2">
                        <FormField name="prompt"
                            render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-10">
                                    <FormControl className="m-0 p-0">
                                        <Input
                                            className="border-0 outline-none focus-visible:ring-0
                                  focus-visible:ring-transparent"
                                            disabled={isLoading}
                                            placeholder="Piono solo"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                            Generate
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="space-y-4 mt-4">
                {isLoading && (
                    <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                        <Loader/>
                    </div>
                )}
                {!music && !isLoading && (
                <Empty label="No music  Generated."/>
                )}
                {music && (
          <audio controls className="w-full mt-8">
            <source src={music} />
          </audio>
        )}
            </div>
        </div>
    )
}
export default MusicPage;