import { mdiDelete, mdiDotsVertical, mdiPencilOutline } from "@mdi/js";
import { Icon } from "@mdi/react";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Container,
  IconButton,
  MenuItem,
  Paper,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { filter } from "lodash";
import { useConfirm } from "material-ui-confirm";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Iconify from "../../../core/iconify";
import setMessage from "../../../core/messages/messages";
import Scrollbar from "../../../core/scrollbar";
import { deleteCareer, getCarreras } from "../store/store";
import ClientsForm from "./ClientsForm";
import ClientsListHead from "./ClientsListHead";
import ClientsListToolbar from "./ClientsListToolbar";

const TABLE_HEAD = [
  { id: "cod_carrera", label: "Código", alignRight: false },
  { id: "nomb_carrera", label: "Nombre carrera", alignRight: false },
  { id: "" },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_career) =>
        String(_career.nomb_carrera)
          .toLowerCase()
          .indexOf(String(query).toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ClientsPage() {
  const [openInRowMenu, setOpenInRowMenu] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("nomb_carrera");
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [refresh, setRefresh] = useState(0);

  const [CARRERASLIST, setCARRERASLIST] = useState([]);

  const confirm = useConfirm();

  const [filteredCareers, setFilteredCareers] = useState([]);
  const [isNotFound, setIsNotFound] = useState(false);
  const [rowsNumber, setRowsNumber] = useState(0);

  useEffect(() => {
    getCarreras()
      .then((response) => {
        if (response.status === 200) {
          setCARRERASLIST(response.data);
        }
      })
      .catch((error) => {
        console.log("Error al cargar las carreras", error);
      });
  }, [refresh]);

  const handleOpenInRowMenu = (event) => {
    setOpenInRowMenu(event.currentTarget);
  };

  const handleCloseInRowMenu = () => {
    setOpenInRowMenu(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = CARRERASLIST.map((n) => n.cod_carrera);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSelectClick = (event, codCarrera) => {
    const selectedIndex = selected.indexOf(codCarrera);
    let newSelected = [];
    if (selectedIndex === -1) {
      // not found, add element to selected list
      newSelected = newSelected.concat(selected, codCarrera);
    } else if (selectedIndex === 0) {
      // found at start, remove first element
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      // found at end, remove the last element
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      // found in the middle, remove that position
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByValue = (event) => {
    setPage(0);
    setFilterValue(event.target.value);
  };

  const handleEditClick = () => {
    if (selected.length === 1) {
      const selectedItem = filteredCareers.find(
        (career) => career.cod_carrera === selected[0]
      );
      if (selectedItem) {
        handleCloseInRowMenu();
        setIsFormVisible(true);
        setEditMode(true);
        setFormData(selectedItem);
      }
    }
  };

  const handleDeleteClick = () => {
    if (selected.length === 1) {
      const selectedItem = filteredCareers.find(
        (career) => career.cod_carrera === selected[0]
      );
      if (selectedItem) {
        confirm({
          content: (
            <Alert
              severity={"warning"}
            >{`¿Desea eliminar la carrera: ${selectedItem.nomb_carrera} ?`}</Alert>
          ),
        })
          .then(() => {
            deleteCareer(selectedItem)
              .then((response) => {
                if (response.status === 200) {
                  setMessage("success", "¡Carrera eliminada con éxito!");
                  setOpenInRowMenu(false);
                  setSelected([]);
                  setRefresh(refresh + 1);
                }
              })
              .catch((error) => {
                console.log("Error al eliminar la carrera", error);
                setMessage("error", "¡Ha ocurrido un error!");
              });
          })
          .catch(() => {});
      }
    }
  };

  const handleMultipleDeleteClick = () => {
    if (selected.length > 0) {
      const selectedItems = filteredCareers.filter((career) =>
        selected.includes(career.cod_carrera)
      );

      confirm({
        content: (
          <Alert
            severity={"warning"}
          >{`¿Desea eliminar las ${selected.length} carreras seleccionadas?`}</Alert>
        ),
      })
        .then(() => {
          // Perform the deletion of multiple records
          Promise.all(
            selectedItems.map((selectedItem) => deleteCareer(selectedItem))
          )
            .then((responses) => {
              const isSuccess = responses.every(
                (response) => response.status === 200
              );

              if (isSuccess) {
                setMessage(
                  "success",
                  `¡${selected.length} carreras eliminadas con éxito!`
                );
                setOpenInRowMenu(false);
                setSelected([]);
                setRefresh(refresh + 1);
              } else {
                setMessage("warning", "¡Alguna carrera no pudo ser eliminada!");
              }
            })
            .catch((error) => {
              console.log("Error al eliminar las carreras", error);
              setMessage("error", "¡Ha ocurrido un error!");
            });
        })
        .catch(() => {});
    }
  };

  const handleRowClick = (codCarrera) => {
    const newSelected = [codCarrera];
    setSelected(newSelected);
  };

  useEffect(() => {
    setRowsNumber(CARRERASLIST.length);
    setFilteredCareers(
      applySortFilter(CARRERASLIST, getComparator(order, orderBy), filterValue)
    );
    setIsNotFound(!filteredCareers.length && !!filterValue);
  }, [CARRERASLIST, filterValue, order, orderBy]);

  return (
    <>
      <Helmet>
        <title> Clients | SAPCE </title>
      </Helmet>

      {isFormVisible ? (
        <ClientsForm
          formData={formData}
          editMode={editMode}
          onSubmit={() => {
            setRefresh(refresh + 1);
            setEditMode(false);
            setFormData({});
            setIsFormVisible(false);
          }}
        />
      ) : (
        <Container>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Typography variant="h4" gutterBottom>
              Clientes
            </Typography>
            <Button
              variant="contained"
              style={{ textTransform: "none" }}
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => {
                setIsFormVisible(true);
                setEditMode(false);
                setFormData({});
              }}
            >
              Registrar Carrera
            </Button>
          </Stack>

          <Card>
            <ClientsListToolbar
              numSelected={selected.length}
              filterValue={filterValue}
              onFilterValue={handleFilterByValue}
              handleDelete={handleMultipleDeleteClick}
            />

            <Scrollbar>
              <TableContainer>
                <Table size="small">
                  <ClientsListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={CARRERASLIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredCareers
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        const { cod_carrera, nomb_carrera, eliminada } = row;
                        const selectedCareer =
                          selected.indexOf(cod_carrera) !== -1;

                        return (
                          <TableRow
                            onClick={() => handleRowClick(cod_carrera)}
                            hover
                            key={cod_carrera}
                            tabIndex={-1}
                            role="checkbox"
                            selected={selectedCareer}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedCareer}
                                onChange={(event) =>
                                  handleSelectClick(event, cod_carrera)
                                }
                              />
                            </TableCell>

                            <TableCell align="left">{cod_carrera}</TableCell>

                            <TableCell align="left">{nomb_carrera}</TableCell>

                            <TableCell align="right">
                              <IconButton
                                size="medium"
                                color="inherit"
                                onClick={handleOpenInRowMenu}
                              >
                                <Icon size={1} path={mdiDotsVertical} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {rowsNumber === 0 && (
                      <TableRow style={{ height: 53 * rowsNumber }}>
                        <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                          Nada que mostrar
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  {isNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <Paper
                            sx={{
                              textAlign: "center",
                            }}
                          >
                            <Typography variant="h6" paragraph>
                              No encontrado
                            </Typography>

                            <Typography variant="body2">
                              No se encuentran resultados para &nbsp;
                              <strong>&quot;{filterValue}&quot;</strong>.
                              <br /> Intente verificar el término o usar
                              palabras completas.
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>
          </Card>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={CARRERASLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage={"Filas por página"}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Container>
      )}

      <Popover
        open={Boolean(openInRowMenu)}
        anchorEl={openInRowMenu}
        onClose={handleCloseInRowMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <Icon size={1} path={mdiPencilOutline} />
          <span style={{ marginLeft: 15 }}>Editar</span>
        </MenuItem>

        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          <Icon size={1} path={mdiDelete} />
          <span style={{ marginLeft: 15 }}>Eliminar</span>
        </MenuItem>
      </Popover>
    </>
  );
}
