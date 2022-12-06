// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// _mock_
import { _invoices } from '../../../../_mock/arrays';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import InvoiceNewEditForm from '../../../../sections/@dashboard/invoice/form';

// ----------------------------------------------------------------------

InvoiceEditPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function InvoiceEditPage() {
  const { themeStretch } = useSettingsContext();

  const {
    query: { id },
  } = useRouter();

  const currentInvoice = _invoices.find((invoice) => invoice.id === id);

  return (
    <>
      <Head>
        <title> 도서 수정 | Poomacy</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="도서 수정"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: '도서목록',
              href: PATH_DASHBOARD.library.list,
            },
            { name: `INV-${currentInvoice?.invoiceNumber}` },
          ]}
        />

        <InvoiceNewEditForm isEdit currentInvoice={currentInvoice} />
      </Container>
    </>
  );
}
