export type TFlat = {
  location: string;
  description: string;
  rentAmount: number;
  bedrooms: number;
  amenities: string[];
  photos: string[];
};

export type IUploadFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};

export interface FlatPhoto {
  imageUrl: string;
}

export interface FlatPayload {
  location: string;
  description: string;
  rentAmount: number;
  bedrooms: number;
  flatPhotos?: { imageUrl: string }[];
  amenities: string;
}
