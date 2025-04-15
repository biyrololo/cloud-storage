import { Header } from "@/widgets/header";
import { Pricing } from "@/widgets/pricing";
import { getMe } from "@/shared/lib/actions/auth/getMe";
import { PromocodeInput } from "@/widgets/promocodeInput";

export default async function PricingPage(){
    const user = await getMe();
    return (
        <>
            <Header />
            <div>
                <Pricing user={user} />
                {
                    user && (
                        <PromocodeInput /> 
                    )
                }
            </div>
        </>
    )
}