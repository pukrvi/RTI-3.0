/**
 * States and Union Territories, for the address block.
 *
 * The live request form has a `State` dropdown in the applicant's personal
 * details. It is worth being clear about what it is for, because the portal is
 * not: this is *where the applicant lives*, not which government holds the
 * information. A citizen in Bihar filing with the Ministry of Railways picks
 * Bihar here and the request still goes to a Central body. The portal's own
 * red banner about State authorities sits on a different screen entirely, so
 * the two get conflated constantly.
 */
export const STATES: readonly string[] = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;
