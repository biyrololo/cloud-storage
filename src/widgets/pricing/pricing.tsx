import { getSize } from "@/shared/lib/size/getSize";
import { PricingOption } from "../pricingOption";
import { User } from "@prisma/client";

export async function Pricing({user}: {user: User | null}){
    let userPlan = 'none';

    if(user){
        userPlan = 'free';
        if(user.maxSpace > getSize('50GB')){
            userPlan = 'enterprise';
        } else if(user.maxSpace > getSize('5GB')){
            userPlan = 'team';
        }
    }

    return (
        <div className="box-border grid grid-cols-1 gap-6 md:grid-cols-3 p-12">
            <PricingOption
                name="Free"
                price={0}
                description="For personal use"
                features={['500MB of storage']}
                selected={userPlan === 'free'}
                variant='secondary'
            />
            <PricingOption
                name="Team"
                price={3}
                description="For small teams"
                features={['5GB of storage']}
                selected={userPlan === 'team'}
                variant='primary'
            />
            <PricingOption
                name="Enterprise"
                price={10}
                description="For large teams"
                features={['50GB of storage']}
                selected={userPlan === 'enterprise'}
                variant='secondary'
            />
        </div>
    )
}