// next
import Head from 'next/head';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import InvoiceNewEditForm from '../../../sections/@dashboard/invoice/form';

// ----------------------------------------------------------------------

InvoiceCreatePage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

// ----------------------------------------------------------------------

export default function InvoiceCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title> 도서 등록 | Poomacy</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="도서 등록"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: '도서 목록',
              href: PATH_DASHBOARD.library.list,
            },
            {
              name: '도서 등록',
            },
          ]}
        />

        <InvoiceNewEditForm />
      </Container>
    </>
  );
}
