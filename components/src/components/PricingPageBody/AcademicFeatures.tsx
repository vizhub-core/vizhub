import { Feature } from './Feature';

export const AcademicFeatures = ({}) => (
  <>
    <Feature
      title="Academic Plan"
      id="academic-plan"
      hasBottomBorder={true}
    >
      Designed specifically for educators and students.
    </Feature>
    <Feature
      title="$199.99 per semester"
      id="academic-price"
      hasBottomBorder={true}
    >
      Flat one-time fee covers your entire class for one
      semester.
    </Feature>
    <Feature
      title="Discount Codes for Students"
      id="discount-codes"
      hasBottomBorder={true}
    >
      A discount code will be provided for use by students.
    </Feature>
    <Feature
      title="Up to 30 Students"
      id="student-limit"
      hasBottomBorder={true}
    >
      Support for classes of up to 30 students per semester.
    </Feature>
    <Feature
      title="5 Months of Premium Access"
      id="premium-duration"
      hasBottomBorder={false}
    >
      Students get 5 months of VizHub Premium with the
      discount code ($1.33/mo compared to $5/mo).
    </Feature>
  </>
);
