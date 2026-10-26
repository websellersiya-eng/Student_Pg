"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { propertyService, referenceService } from "@/services/property-service";
import { storageService, uploadToCloudinary } from "@/services/storage-service";
import type { Property } from "@/types/domain";

type ImageEntry = {
  url: string;
  storageKey?: string;
  id?: string;
  isCover: boolean;
};

type PropertyFormProps = {
  mode: "create" | "edit";
  propertyId?: string;
  initialValues?: Property;
};

const textareaClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100";

const selectClass =
  "h-11 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";

export function PropertyForm({ mode, propertyId, initialValues }: Readonly<PropertyFormProps>) {
  const router = useRouter();
  const cities = useQuery({ queryKey: ["cities"], queryFn: referenceService.cities });
  const amenities = useQuery({ queryKey: ["amenities"], queryFn: referenceService.amenities });
  const mutation = useMutation({ mutationFn: async (input: unknown) => {
    if (mode === "edit" && propertyId) return propertyService.update(propertyId, input);
    return propertyService.create(input);
  } });

  const [selectedCityId, setSelectedCityId] = useState(initialValues?.cityId ?? "");
  const [images, setImages] = useState<ImageEntry[]>(
    (initialValues?.images ?? []).map((image) => ({
      id: image.id,
      url: image.url,
      storageKey: image.storageKey,
      isCover: image.isCover
    }))
  );
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ name: string; url: string }[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const selectedCity = cities.data?.data?.find((city) => city.id === selectedCityId);

  const addImageUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setImages((prev) => [...prev, { url: trimmed, isCover: prev.length === 0 }]);
    setUrlInput("");
  };

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next = Array.from(files);
    setPendingFiles((prev) => [...prev, ...next]);
    setPreviews((prev) => [
      ...prev,
      ...next.map((file) => ({ name: file.name, url: URL.createObjectURL(file) }))
    ]);
  };

  const removePending = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeSaved = async (index: number) => {
    const image = images[index];
    if (image.id) {
      try {
        await storageService.deleteImage(image.id);
      } catch {
        // DB row removed next submit; fall through
      }
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    const input: Record<string, unknown> = {
      name: formData.get("name"),
      propertyType: formData.get("propertyType"),
      description: formData.get("description"),
      addressLine: formData.get("addressLine"),
      cityId: formData.get("cityId"),
      localityId: formData.get("localityId"),
      latitude: Number(formData.get("latitude")),
      longitude: Number(formData.get("longitude")),
      monthlyRent: Number(formData.get("monthlyRent")),
      securityDeposit: Number(formData.get("securityDeposit") || 0),
      genderPreference: formData.get("genderPreference"),
      availableBeds: Number(formData.get("availableBeds")),
      totalBeds: Number(formData.get("totalBeds")),
      amenityIds: formData.getAll("amenityIds")
    };

    const rules = String(formData.get("rules") ?? "").trim();
    if (rules) input.rules = rules;
    const contactName = String(formData.get("contactName") ?? "").trim();
    const contactPhone = String(formData.get("contactPhone") ?? "").trim();
    if (contactName) input.contactName = contactName;
    if (contactPhone) input.contactPhone = contactPhone;

    try {
      const uploaded: { url: string; storageKey: string }[] = [];
      if (pendingFiles.length > 0) {
        const sig = await storageService.signature();
        for (const file of pendingFiles) {
          uploaded.push(await uploadToCloudinary(file, sig.data!));
        }
      }
      const allImages: ImageEntry[] = [
        ...images.map((image) => ({
          url: image.url,
          ...(image.storageKey ? { storageKey: image.storageKey } : {})
        })),
        ...uploaded.map((image) => ({ url: image.url, storageKey: image.storageKey }))
      ].map((image, index) => ({ ...image, isCover: index === 0 }));
      input.images = allImages;

      await mutation.mutateAsync(input);
      router.push("/owner/properties");
    } catch {
      setError(
        "Could not save the property. If you added photos, make sure Cloudinary is configured in the backend .env."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-lg border bg-white p-5">
      <Input name="name" placeholder="Property name" defaultValue={initialValues?.name} required />
      <select name="propertyType" className={selectClass} defaultValue={initialValues?.propertyType ?? "PG"}>
        <option value="PG">PG</option>
        <option value="HOSTEL">Hostel</option>
      </select>
      <textarea
        name="description"
        placeholder="Description (at least 20 characters)"
        className={`${textareaClass} min-h-28`}
        defaultValue={initialValues?.description}
        required
      />
      <Input name="addressLine" placeholder="Address" defaultValue={initialValues?.addressLine} required />
      <select
        name="cityId"
        className={selectClass}
        value={selectedCityId}
        onChange={(event) => setSelectedCityId(event.target.value)}
        required
      >
        <option value="">Select city</option>
        {cities.data?.data?.map((city) => (
          <option key={city.id} value={city.id}>{city.name}</option>
        ))}
      </select>
      <select name="localityId" className={selectClass} defaultValue={initialValues?.localityId} required>
        <option value="">Select locality</option>
        {selectedCity?.localities.map((locality) => (
          <option key={locality.id} value={locality.id}>{locality.name}</option>
        ))}
      </select>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="latitude" type="number" step="0.0000001" placeholder="Latitude"
          defaultValue={initialValues?.latitude} required />
        <Input name="longitude" type="number" step="0.0000001" placeholder="Longitude"
          defaultValue={initialValues?.longitude} required />
        <Input name="monthlyRent" type="number" placeholder="Monthly rent"
          defaultValue={initialValues?.monthlyRent} required />
        <Input name="securityDeposit" type="number" placeholder="Security deposit"
          defaultValue={initialValues?.securityDeposit} />
        <Input name="availableBeds" type="number" placeholder="Available beds"
          defaultValue={initialValues?.availableBeds} required />
        <Input name="totalBeds" type="number" placeholder="Total beds"
          defaultValue={initialValues?.totalBeds} required />
      </div>
      <select name="genderPreference" className={selectClass} defaultValue={initialValues?.genderPreference ?? "ANY"}>
        <option value="ANY">Any</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
      </select>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="contactName" placeholder="Contact person name (shown to students)"
          defaultValue={initialValues?.contactName} />
        <Input name="contactPhone" placeholder="Contact phone (shown to students)"
          defaultValue={initialValues?.contactPhone} />
      </div>

      <div className="rounded-lg border border-dashed border-slate-300 p-4">
        <p className="text-sm font-semibold text-slate-700">Property photos</p>
        <p className="mt-1 text-xs text-slate-500">
          Photos are uploaded to Cloudinary. The first photo is used as the cover.
        </p>

        <div className="mt-4 grid gap-3">
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <ImagePlus size={17} />
            Choose images
            <input type="file" accept="image/*" multiple hidden onChange={(event) => addFiles(event.target.files)} />
          </label>

          <div className="flex gap-2">
            <Input value={urlInput} onChange={(event) => setUrlInput(event.target.value)}
              placeholder="...or paste an image URL" />
            <Button type="button" variant="secondary" onClick={addImageUrl}>Add</Button>
          </div>
        </div>

        {(images.length > 0 || previews.length > 0) ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((image, index) => (
              <div key={`saved-${image.id ?? image.url}`} className="relative">
                <img src={image.url} alt="" className="aspect-[4/3] w-full rounded-md border border-slate-200 object-cover" />
                {index === 0 ? (
                  <span className="absolute left-2 top-2 rounded-md bg-brand-600 px-2 py-0.5 text-[11px] font-semibold text-white">Cover</span>
                ) : null}
                <button
                  type="button"
                  onClick={() => removeSaved(index)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-slate-950/70 text-white hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {previews.map((preview, index) => (
              <div key={`pending-${preview.name}-${index}`} className="relative">
                <img src={preview.url} alt="" className="aspect-[4/3] w-full rounded-md border border-slate-200 object-cover" />
                <button
                  type="button"
                  onClick={() => removePending(index)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-slate-950/70 text-white hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <textarea
        name="rules"
        placeholder="House rules (optional)"
        className={`${textareaClass} min-h-24`}
        defaultValue={initialValues?.rules}
      />

      <p className="text-sm font-semibold text-slate-700">Amenities</p>
      <div className="flex flex-wrap gap-3">
        {amenities.data?.data?.map((amenity) => {
          const checked = initialValues?.amenities?.some((item) => item.amenity.id === amenity.id);
          return (
            <label key={amenity.id} className="flex items-center gap-2 text-sm">
              <input name="amenityIds" type="checkbox" value={amenity.id} defaultChecked={checked} />
              {amenity.name}
            </label>
          );
        })}
      </div>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <Button type="submit" disabled={mutation.isPending} className="gap-2">
        {mutation.isPending ? <Loader2 size={17} className="animate-spin" /> : null}
        {mode === "edit" ? "Save changes" : "Create property"}
      </Button>
      <p className="text-xs text-slate-500">
        {mode === "edit"
          ? "Updated properties are reviewed again by the admin. Existing photos can be removed; new ones are uploaded to Cloudinary."
          : "New properties stay pending until approved by an admin."}
      </p>
    </form>
  );
}