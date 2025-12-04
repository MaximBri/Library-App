import { STATUS_OPTIONS } from '@/features/status-modal/constants';
import { FormBuilder } from '@/shared/components/FormBuilder/FormBuilder';
import type { ReportForm } from './types';
import { baseFields, formFieldsArr, reportSchema } from './constants';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { CustomFormBuilder } from '../CustomFormBuilder/CustomFormBuilder';

export const ReportWrapper = () => {
  const { watch, handleSubmit, register, formState: {errors} } = useForm<ReportForm>();
  const reportType = watch('type');

  const [formFields, setFormFields] = useState([...baseFields]);

  const reportFields = formFieldsArr.find((field) => field.name === reportType);
  const fields = [...baseFields];
  if (reportFields?.fields) {
    fields.push(...reportFields.fields);
  }
  console.log(fields);
  console.log(watch());

  const onSubmit = (data: ReportForm) => {
    const status = STATUS_OPTIONS.find(
      (item) => item.text === data.status
    )?.value;
    if (!status) return;
    // onSubmit({
    //   status: status,
    //   librarianComment: data.librarianComment ? data.librarianComment : '',
    // });
  };

  const isLoading = false;
  console.log(reportType);
  useEffect(() => {
    const reportFields = formFieldsArr.find(
      (field) => field.name === reportType
    );
    console.log(reportFields);
    if (reportFields?.fields) {
      setFormFields([...baseFields, ...reportFields.fields]);
    } else {
      setFormFields([...baseFields]);
    }
  }, [reportType]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
      <CustomFormBuilder<ReportForm>
        fields={fields}
        errors={errors}
        register={register}
      />
    </form>
  );
};
