export type UserRole = "STUDENT" | "OWNER" | "ADMIN";
export type PropertyType = "PG" | "HOSTEL";
export type GenderPreference = "MALE" | "FEMALE" | "ANY";
export type PropertyStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
export type BookingStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "COMPLETED";

export type City = {
  id: string;
  name: string;
  slug: string;
  state: string;
  localities: Locality[];
};

export type Locality = {
  id: string;
  cityId: string;
  name: string;
  slug: string;
};

export type Amenity = {
  id: string;
  name: string;
  slug: string;
  icon?: string;
};

export type Property = {
  id: string;
  name: string;
  slug: string;
  propertyType: PropertyType;
  description: string;
  addressLine: string;
  cityId?: string;
  localityId?: string;
  latitude: string;
  longitude: string;
  monthlyRent: string;
  securityDeposit?: string;
  genderPreference: GenderPreference;
  availableBeds: number;
  totalBeds: number;
  status: PropertyStatus;
  isActive: boolean;
  rules?: string;
  rejectionReason?: string;
  contactName?: string;
  contactPhone?: string;
  city: City;
  locality: Locality;
  owner?: {
    id: string;
    businessName?: string;
    user: { id: string; name: string; email: string; phone?: string };
  };
  images: {
    id: string;
    url: string;
    storageKey?: string;
    altText?: string;
    isCover: boolean;
  }[];
  amenities: { amenity: Amenity }[];
  averageRating?: number;
  reviewCount?: number;
};

export type Booking = {
  id: string;
  status: BookingStatus;
  message?: string;
  ownerResponse?: string;
  property: Property;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: string;
  createdAt?: string;
  studentProfile?: {
    collegeName?: string;
    courseName?: string;
    preferredCity?: string;
    guardianPhone?: string;
  } | null;
  ownerProfile?: {
    businessName?: string;
    address?: string;
    isVerified?: boolean;
  } | null;
};

export type InquiryStatus = "NEW" | "CONTACTED" | "CLOSED";

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  status: InquiryStatus;
  createdAt: string;
  property: { id: string; name: string; owner?: { user: { name: string; email: string } } };
};
