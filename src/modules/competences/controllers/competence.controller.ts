import { Controller } from "@nestjs/common";

import { CompetenceService } from "../services/competence.service";

@Controller('users/:userId/competences')
export class CompetenceController {
    public constructor(private readonly competenceSercice: CompetenceService) {}
}
