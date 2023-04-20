interface CompanyAttr {
  name?: string;
  socialReason?: string;
  localization?: string;
  cif?: string;
  address?: string;
  postalCode?: string;
  phone?: string;
}

export interface AccountInfoAttr {
  companyData?: CompanyAttr;
  paymentType?: "stripe" | "local";
  privateKey?: string;
}

export interface UploadLogoAttr {
  accountImage: File | Blob;
}

export interface AddDomainsAttr {
  domains: string[];
}

export interface DeleteDomainAttr {
  domain: string;
}
