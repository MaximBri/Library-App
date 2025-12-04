import { Modal } from '@/shared/components/Modal/Modal';
import { type FC } from 'react';
import type { GetReportProps } from './types';
import { ReportWrapper } from './ReportWrapper/ReportWrapper';

export const GetReport: FC<GetReportProps> = ({ handleClose, isOpen }) => {
  console.log(isOpen);
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Получить отчёт">
      <ReportWrapper />
    </Modal>
  );
};
