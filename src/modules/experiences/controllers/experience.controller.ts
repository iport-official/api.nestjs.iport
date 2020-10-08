import { Controller } from '@nestjs/common'

import { ExperienceService } from '../services/experience.service'

@Controller()
export class ExperienceController {
    public constructor(private readonly experienceService: ExperienceService) {}
}
