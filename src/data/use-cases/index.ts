// Single aggregation point for the Use Case Library data. Shared by
// /use-cases (the React library page) and the MCP server in src/worker.js,
// so the two can never disagree about what's in the library.
import { categories } from './categories';
import { useCases as adminUseCases } from './admin';
import { useCases as salesUseCases } from './sales';
import { useCases as marketingUseCases } from './marketing';
import { useCases as gcUseCases } from './gc';
import { useCases as coachesUseCases } from './coaches';
import { useCases as homeServicesUseCases } from './home-services';
import { useCases as realEstateUseCases } from './real-estate';
import { useCases as propertyManagementUseCases } from './property-management';
import { useCases as professionalServicesUseCases } from './professional-services';
import { useCases as healthWellnessUseCases } from './health-wellness';
import { useCases as financeUseCases } from './finance';
import { useCases as customerServiceUseCases } from './customer-service';
import { useCases as hiringHrUseCases } from './hiring-hr';
import { useCases as operationsUseCases } from './operations';
import { useCases as personalUseCases } from './personal';

export { categories };

export const useCases = [
  ...adminUseCases,
  ...salesUseCases,
  ...marketingUseCases,
  ...gcUseCases,
  ...coachesUseCases,
  ...homeServicesUseCases,
  ...realEstateUseCases,
  ...propertyManagementUseCases,
  ...professionalServicesUseCases,
  ...healthWellnessUseCases,
  ...financeUseCases,
  ...customerServiceUseCases,
  ...hiringHrUseCases,
  ...operationsUseCases,
  ...personalUseCases,
];
