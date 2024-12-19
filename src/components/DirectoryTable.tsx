import { useState } from 'react';
import type { User } from '@/data/userData';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  CaretSortIcon,
} from '@radix-ui/react-icons';
import {
  Center,
  Group,
  keys,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
  Pill,
  Button,
  Pagination,
} from '@mantine/core';
import Link from 'next/link';
import { capitalize } from '@/util';

const ITEMS_PER_PAGE = 20;

// Adjust User Interface so we can search and sort by name too
interface RowData extends User {
  name: string;
}

interface ThProps {
  value: string;
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}

const tableHeaders = ['Name', 'Role', 'Email', 'Industry', 'Gender'];

function Th({ value, children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted
    ? reversed
      ? ChevronUpIcon
      : ChevronDownIcon
    : CaretSortIcon;
  return (
    <Table.Th className={`p-0 ${value === 'Email' ? 'w-64' : ''}`}>
      <UnstyledButton
        onClick={onSort}
        className="w-full px-4 py-2 hover:bg-sky-100 rounded-xl transition-colors"
      >
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className="w-6 h-6 rounded-full">
            <Icon scale={16} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: User[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => {
      if (typeof item[key] === 'string') {
        // This is here cause 'male' is in female so the search results are mixed
        if (query === 'male') {
          return item[key].toLowerCase() === query;
        }
        return item[key].toLowerCase().includes(query);
      }
      return false;
    }),
  );
}

function sortData(
  data: User[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string },
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      // handle name sorting separately
      if (sortBy === 'name') {
        const nameA = a.firstName + ' ' + a.lastName;
        const nameB = b.firstName + ' ' + b.lastName;
        return payload.reversed
          ? nameB.localeCompare(nameA)
          : nameA.localeCompare(nameB);
      }

      // handle other User properties
      const valueA = a[sortBy as keyof User]?.toString();
      const valueB = b[sortBy as keyof User]?.toString();

      // edge case that value is empty
      if (!valueA) {
        return 1;
      }
      if (!valueB) {
        return -1;
      }

      if (payload.reversed) {
        return valueB.localeCompare(valueA);
      }

      return valueA.localeCompare(valueB);
    }),
    payload.search,
  );
}

export default function DirectoryTable({ data }: { data: User[] }) {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState<User[]>(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setCurrentPage(1);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value }),
    );
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const rows = paginatedData.map((row) => (
    <Table.Tr key={row._id}>
      <Table.Td>{row.firstName + ' ' + row.lastName}</Table.Td>
      <Table.Td>
        {row.role === 'admin' && (
          <Pill size="md" className="bg-red-700 text-white">
            Staff
          </Pill>
        )}
        {row.role === 'mentor' && (
          <Pill size="md" className=" bg-blue-700 text-white">
            {capitalize(row.role)}
          </Pill>
        )}
        {row.role === 'mentee' && (
          <Pill size="md" className=" bg-sky-600 text-white">
            {capitalize(row.role)}
          </Pill>
        )}
      </Table.Td>
      <Table.Td>{row.email.toLowerCase()}</Table.Td>
      <Table.Td>{row.industry ? row.industry : 'N/A'}</Table.Td>
      <Table.Td>{capitalize(row.gender)}</Table.Td>
      <Table.Td>
        <Button
          size="sm"
          color="blue"
          variant="outline"
          component={Link}
          href={`/profile/${row._id}`}
        >
          View Profile
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <TextInput
        size="lg"
        placeholder="Search by any field"
        mb="lg"
        leftSection={<MagnifyingGlassIcon className="w-6 h-5" />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        miw={700}
        layout="fixed"
      >
        <Table.Tbody>
          <Table.Tr>
            {tableHeaders.map((columnTitle) => {
              return (
                <Th
                  key={columnTitle}
                  sorted={sortBy === columnTitle.toLowerCase()}
                  reversed={reverseSortDirection}
                  onSort={() =>
                    setSorting(columnTitle.toLowerCase() as keyof User)
                  }
                  value={columnTitle}
                >
                  {columnTitle}
                </Th>
              );
            })}
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={Object.keys(data[0]).length}>
                <Text fw={500} ta="center">
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
      <Center>
        <Pagination
          total={Math.ceil(sortedData.length / ITEMS_PER_PAGE)}
          value={currentPage}
          onChange={setCurrentPage}
          className="pt-5"
        />
      </Center>
    </ScrollArea>
  );
}
