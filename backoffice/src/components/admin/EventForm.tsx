"use client";

import { UploadFormProvider, useUploadForm } from "./UploadFormContext";

function EventFormInner({
  action,
  children,
  className,
}: {
  action: (formData: FormData) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
}) {
  const { isUploading } = useUploadForm();

  return (
    <form
      action={action}
      className={className}
      onSubmit={(e) => {
        if (isUploading) {
          e.preventDefault();
        }
      }}
    >
      {children}
      {isUploading ? (
        <p className="sr-only" aria-live="polite">
          Téléversement en cours, veuillez patienter.
        </p>
      ) : null}
    </form>
  );
}

export function EventForm({
  action,
  children,
  className = "grid grid-cols-1 gap-4 md:grid-cols-2",
}: {
  action: (formData: FormData) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <UploadFormProvider>
      <EventFormInner action={action} className={className}>
        {children}
      </EventFormInner>
    </UploadFormProvider>
  );
}
