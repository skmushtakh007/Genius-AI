"use client"
import * as z from "zod";
import axios from "axios";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { Heading } from "@/components/ui/heading";
import {  Video } from "lucide-react";
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
    const proModal = useProModal()
    const router = useRouter();
    const [video, setVideo] = useState<string>();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setVideo(undefined);
            
            
            const response = await axios.post("/api/video",values)
            setVideo(response.data[0]);
          

            form.reset();
        }
        catch (error: any) {
            if(error?.response?.status === 403){
                proModal.onOpen();
            }else{
                toast.error("somthing went wront")
            }
        } finally {
            router.refresh();
        }
    }
    return (
        <div>
            <Heading
                title="Video Generation"
                description="Turn your prompt into video."
                icon={Video}
                iconColor="text-orange-700"
                bgColor="bg-orange-700/10"
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
                                            placeholder="clown fish swimming around a coral reef."
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
                {!video && !isLoading && (
                <Empty label="No video  Generated."/>
                )}
                {video && (
          <video controls className="w-full aspect-video rounded-lg mt-8">
            <source src={video} />
          </video>
        )}
            </div>
        </div>
    )
}
export default MusicPage;