import { useState } from 'react';
// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Table,
  Stack,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  Tabs,
  Tab,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// @types
import { IBooks, IResult } from '../../../@types/library';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
// sections
import LibraryAnalytic from '../../../sections/@dashboard/library/libraryAnalytic';

// notion sdk
import { Client } from "@notionhq/client";
import LibraryTableRow from 'src/sections/@dashboard/library/list/libraryTableRow';
import LibraryTableToolbar from 'src/sections/@dashboard/library/list/libraryTableToolbar';
import Label from 'src/components/label';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'book', label: '도서명 및 출판사', align: 'left' , width: 400 },
  { id: 'purchaseDate', label: '구매일시', align: 'left' , width: 150 },
  { id: 'list_price', label: '구매가격', align: 'center', width: 100 },
  { id: 'quantity', label: '수량', align: 'center'  , width: 100 },
  { id: 'purchaser', label: '요청자', align: 'center' , width: 100 },
  { id: 'location', label: '위치', align: 'center' , width: 100 },
  { id: 'edit', label: '편집', align: 'center' },
];

// 노션 API 데이터를 가져오기위해 getStaticProps 추가 서버사이드 랜더링 
export const getStaticProps = async () => {
  
  // 노션 인증키 객체 생성 (노션 SDK : https://github.com/makenotion/notion-sdk-js)
  const notion = new Client({
    auth: process.env.NOTION_SECRET,
  });

  let books = [];

  // 노션 DATABASE API에 DATABASE_ID로 API 호출하여 응답결과 data에 저장
  let data = await notion.databases.query({
    database_id: `${process.env.DATABASE_ID}`,
  });

  // books 배열에 입력
  books = [...data.results];

  // has_more = false 마지막 데이터가 없을때 까지 반복
  while (data.has_more) {
    data = await notion.databases.query({
      database_id: `${process.env.DATABASE_ID}`,
      start_cursor: `${data.next_cursor}`,
    });

    // books에 증분 추가
    books = [...books, ...data.results];
  }

  //{ props: books } 빌드타임에 받아서 LibraryListPage로 보낸다
  return {
    props: {
      books,
    },
  };
};


// ----------------------------------------------------------------------

LibraryListPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

//getStaticProps()에서 받은 데이터값을 props { books } 로 받음
export default function LibraryListPage({ books }: { books: IResult[] }) {
  console.log(books)

  
  const library: IBooks[] = books.map((row) => ({
    id: row.id,
    book_no: row.properties.book_no.number,
    book: row.properties.book.title[0].text.content,
    publisher: row.properties.publisher.rich_text[0].text.content,
    purchaseDate: new Date(row.properties.purchaseDate.rich_text[0].text.content),
    quantity: row.properties.quantity.number,
    price: row.properties.price.number,
    list_price: row.properties.list_price.number,
    author: row.properties.author.rich_text[0].text.content,
    purchaser: row.properties.purchaser.rich_text[0]?.text.content,
    location: row.properties.location.select?.name,
    locationColor: row.properties.location.select?.color,
  }));
  console.log(library[0])
  console.log(books[0])
  
  const theme = useTheme();

  const { themeStretch } = useSettingsContext();

  const { push } = useRouter();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'purchaseDate' });

  const [libraryData, setLibrarysData] = useState(library);

  const [filterName, setFilterName] = useState('');

  const [filterLocation, setFilterLocation] = useState('all');

  const [openConfirm, setOpenConfirm] = useState(false);

  const dataFiltered = applyFilter({
    inputData: libraryData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterLocation,
  });
  
  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 56 : 76;

  const isFiltered =
    filterLocation !== 'all' ||
    filterName !== '' ;

  const isNotFound =
    (!dataFiltered.length && !!filterLocation) ||
    (!dataFiltered.length && !!filterName);


  const getLengthByLocation = (location: string) =>
    location === 'all' ? libraryData.length :
    libraryData.filter((item) => item.location === location).length;

  const getPercentByLocation = (location: string) =>
    (getLengthByLocation(location) / libraryData.length) * 100;

  // location에서 중복값제거  
  const locationFilter = library.filter(
    (arr, index, callback) => index === callback.findIndex(t => t.location === arr.location)
  );

  // locationColor를 LabelColor 색으로 변경
  locationFilter.map((row) => {
    switch(row.locationColor){
    case 'blue' : 
      row.locationColor = 'success';
      break;
    case 'orange' : 
      row.locationColor = 'primary';
      break;
    case 'red' : 
      row.locationColor = 'secondary';
      break;
    case 'perple' : 
      row.locationColor = 'default';
      break;
    default : 
      row.locationColor = 'default';
      break;
    }
  });
  console.log(locationFilter)
  
 

  const TABS: any[] = locationFilter.map((row) => ({
    value: row.location,
    label: row.location,
    color: row.locationColor,
    count: getLengthByLocation(row.location) 
  }));
  
  TABS.unshift({
    value: 'all',
    label: '전체',
    color: 'info',
    count: libraryData.length
  })



  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterLocation = (event: React.SyntheticEvent<Element, Event>, newValue: string) => {
      setPage(0);
      setFilterLocation(newValue);
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDeleteRow = (id: string) => {
    const deleteRow = libraryData.filter((row) => row.id !== id);
    setSelected([]);
    setLibrarysData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteRows = (selected: string[]) => {
    const deleteRows = libraryData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setLibrarysData(deleteRows);

    if (page > 0) {
      if (selected.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selected.length === dataFiltered.length) {
        setPage(0);
      } else if (selected.length > dataInPage.length) {
        const newPage = Math.ceil((libraryData.length - selected.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleEditRow = (id: string) => {
    push(PATH_DASHBOARD.library.edit(id));
  };

  const handleViewRow = (id: string) => {
    push(PATH_DASHBOARD.library.view(id));
  };

  const handleResetFilter = () => {
    setFilterName('');
  };

  return (
    <>
      <Head>
        <title> 도서목록 | Poomacy </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="도서목록"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: '도서관',
              href: PATH_DASHBOARD.library.root,
            },
            {
              name: '도서목록',
            },
          ]}
          action={
            <NextLink href={PATH_DASHBOARD.library.new} passHref>
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                도서 등록
              </Button>
            </NextLink>
          }
        />

        <Card sx={{ mb: 5 }}>
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              {TABS.map((tab) => (
                <LibraryAnalytic
                  key={tab.value}
                  title={tab.label}
                  total={getLengthByLocation(tab.value)}
                  percent={getPercentByLocation(tab.value)}
                  icon="eva:checkmark-circle-2-fill"
                  color={`theme.palette.${tab.color}.main`}
                />
              ))}
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
        <Tabs
            value={filterLocation}
            onChange={handleFilterLocation}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                icon={
                  <Label color={tab.color} sx={{ mr: 1 }}>
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <Divider />
          <LibraryTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={libraryData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  libraryData.map((row) => row.id)
                )
              }
              action={
                <Stack direction="row">
                  <Tooltip title="Sent">
                    <IconButton color="primary">
                      <Iconify icon="ic:round-send" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download">
                    <IconButton color="primary">
                      <Iconify icon="eva:download-outline" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Print">
                    <IconButton color="primary">
                      <Iconify icon="eva:printer-fill" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={handleOpenConfirm}>
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={libraryData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      libraryData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <LibraryTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, libraryData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterLocation,
}: {
  inputData: IBooks[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterLocation: string;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  console.log('filterName', filterName)
  console.log('libraryData.book', inputData.map)
  if (filterName) {
    inputData = inputData.filter(
      (libraryData) =>
      libraryData.book.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterLocation !== 'all') {
    inputData = inputData.filter((library) => library.location === filterLocation);
  }

  return inputData;
}
