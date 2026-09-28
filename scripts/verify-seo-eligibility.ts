import assert from "node:assert/strict";
import { DOCTORS } from "../src/data/doctors";
import { NCR_AREAS } from "../src/data/locations";
import { PROCEDURES } from "../src/data/procedures";
import {
  indexableLocationDoctorParams,
  indexableLocationTreatmentParams,
  isDoctorApprovedForProcedure,
  shouldPublishLocationTreatment,
} from "../src/lib/ncrLocationStrategy";

const previousSitemapCounts = {
  total: 3437,
  locationArea: 41,
  locationProcedure: 1107,
  locationProcedureDoctor: 2214,
};

const locationProcedureParams = indexableLocationTreatmentParams(PROCEDURES);
const locationDoctorParams = indexableLocationDoctorParams(PROCEDURES, DOCTORS);

assert(locationProcedureParams.length < previousSitemapCounts.locationProcedure);
assert(locationDoctorParams.length < previousSitemapCounts.locationProcedureDoctor);

for (const param of locationProcedureParams) {
  assert.equal(
    shouldPublishLocationTreatment(param.area, param.treatment),
    true,
    `Unexpected location procedure URL: ${param.city}/${param.area}/${param.treatment}`,
  );
}

for (const param of locationDoctorParams) {
  const procedure = PROCEDURES.find((item) => item.slug === param.treatment);
  assert(procedure, `Missing procedure for ${param.treatment}`);
  assert.equal(
    isDoctorApprovedForProcedure(procedure, param.doctor),
    true,
    `Invalid doctor/procedure URL: ${param.city}/${param.area}/${param.treatment}/${param.doctor}`,
  );
}

const afterSitemapCounts = {
  topLevelAndHubs: 16,
  locationCity: new Set(NCR_AREAS.map((area) => area.citySlug)).size,
  locationArea: NCR_AREAS.length,
  locationProcedure: locationProcedureParams.length,
  locationProcedureDoctor: locationDoctorParams.length,
};

console.log(JSON.stringify({
  before: previousSitemapCounts,
  after: afterSitemapCounts,
}, null, 2));
