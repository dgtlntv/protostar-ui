import {
  Badge,
  Container,
  Heading,
  SkeletonText,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { z } from 'zod'

import { PrototypesService } from '../../client/index.ts'
import ActionsMenu from '../../components/Common/ActionsMenu.tsx'
import Navbar from '../../components/Common/Navbar.tsx'
import { PaginationFooter } from '../../components/Common/PaginationFooter.tsx'
import AddPrototype from '../../components/Prototypes/AddPrototype.tsx'

const prototypesSearchSchema = z.object({
  page: z.number().catch(1),
})

export const Route = createFileRoute('/_layout/prototype/all')({
  component: Prototypes,
  validateSearch: (search) => prototypesSearchSchema.parse(search),
})

const PER_PAGE = 5

function getPrototypesQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      PrototypesService.readPrototypes({
        skip: (page - 1) * PER_PAGE,
        limit: PER_PAGE,
      }),
    queryKey: ['prototypes', { page }],
  }
}

function PrototypesTable() {
  const queryClient = useQueryClient()
  const { page } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const setPage = (page: number) =>
    navigate({
      search: (prev: { [key: string]: string }) => ({ ...prev, page }),
    })

  const {
    data: prototypes,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...getPrototypesQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  })

  const hasNextPage = !isPlaceholderData && prototypes?.data.length === PER_PAGE
  const hasPreviousPage = page > 1

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(getPrototypesQueryOptions({ page: page + 1 }))
    }
  }, [page, queryClient, hasNextPage])

  return (
    <>
      <TableContainer>
        <Table size={{ base: 'sm', md: 'md' }}>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Title</Th>
              <Th>Description</Th>
              <Th>Visibility</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          {isPending ? (
            <Tbody>
              <Tr>
                {new Array(5).fill(null).map((_, index) => (
                  <Td key={index}>
                    <SkeletonText noOfLines={1} paddingBlock="16px" />
                  </Td>
                ))}
              </Tr>
            </Tbody>
          ) : (
            <Tbody>
              {prototypes?.data.map((prototype) => (
                <Tr key={prototype.id} opacity={isPlaceholderData ? 0.5 : 1}>
                  <Td>{prototype.id}</Td>
                  <Td isTruncated maxWidth="150px">
                    {prototype.title}
                  </Td>
                  <Td
                    color={!prototype.description ? 'ui.dim' : 'inherit'}
                    isTruncated
                    maxWidth="150px"
                  >
                    {prototype.description || 'N/A'}
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={
                        prototype.visibility === 'public' ? 'green' : 'gray'
                      }
                    >
                      {prototype.visibility}
                    </Badge>
                  </Td>
                  <Td>
                    <ActionsMenu type={'Prototype'} value={prototype} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          )}
        </Table>
      </TableContainer>
      <PaginationFooter
        page={page}
        onChangePage={setPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />
    </>
  )
}

function Prototypes() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} pt={12}>
        Prototypes Management
      </Heading>

      <Navbar type={'Prototype'} addModalAs={AddPrototype} />
      <PrototypesTable />
    </Container>
  )
}
