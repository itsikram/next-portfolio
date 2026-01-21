import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import ImportExport from '../import-export';

const AdminImportExport: React.FC = () => {
  return (
    <AdminLayout>
      <ImportExport />
    </AdminLayout>
  );
};

export default AdminImportExport;
