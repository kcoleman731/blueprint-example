import { ArnPrincipal } from "@aws-cdk/aws-iam";

import { PlatformTeam } from '@shapirov/cdk-eks-blueprint';

export class AdminTeam extends PlatformTeam {
    constructor(accountID: string) {
        super({
            name: "platform",
            users: [new ArnPrincipal(`arn:aws:iam::${accountID}:user/kevin-coleman`)]
        })
    }
}