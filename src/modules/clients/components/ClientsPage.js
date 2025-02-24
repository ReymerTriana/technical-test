import {
  mdiArrowLeft,
  mdiDelete,
  mdiDotsVertical,
  mdiPencilOutline,
  mdiPlus,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Popover,
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
import { useHistory, useLocation } from "react-router-dom";
import { UseAuthContext } from "src/modules/auth/context/AuthProvider";
import setMessage from "../../../core/messages/messages";
import Scrollbar from "../../../core/scrollbar";
import { deleteClient, getClientById, getClients } from "../store/store";
import ClientsForm from "./ClientsForm";
import ClientsListHead from "./ClientsListHead";
import ClientsListToolbar from "./ClientsListToolbar";

const TABLE_HEAD = [
  { id: "identificacion", label: "Identificación", alignRight: false },
  { id: "nomb_completo", label: "Nombre completo", alignRight: false },
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
      (_client) =>
        String(_client.nombre)
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
  const [orderBy, setOrderBy] = useState("nombre");
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [refresh, setRefresh] = useState(0);

  const [CLIENTSLIST, setCLIENTSLIST] = useState([]);

  const confirm = useConfirm();

  const [filteredClients, setFilteredClients] = useState([]);
  const [isNotFound, setIsNotFound] = useState(false);
  const [rowsNumber, setRowsNumber] = useState(0);
  const { auth } = UseAuthContext();
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (auth.userid) {
      getClients(auth.userid)
        .then((response) => {
          if (response.status === 200) {
            setCLIENTSLIST(response.data);
          }
        })
        .catch((error) => {
          console.log("Error al cargar los clientes", error);
        });
    }
  }, [auth.userid, refresh]);

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
      const newSelecteds = CLIENTSLIST.map((n) => n.id);
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
      const selectedItem = filteredClients.find(
        (client) => client.id === selected[0]
      );
      if (selectedItem) {
        getClientById(selectedItem.id).then((response) => {
          if (response.status === 200) {
            handleCloseInRowMenu();
            setIsFormVisible(true);
            setEditMode(true);
            setFormData(response.data);
          } else {
            handleCloseInRowMenu();
            setMessage("error", "¡Ha ocurrido un error!");
          }
        });
      }
    }
  };

  const handleDeleteClick = () => {
    if (selected.length === 1) {
      const selectedItem = filteredClients.find(
        (client) => client.id === selected[0]
      );
      if (selectedItem) {
        confirm({
          content: (
            <Alert
              severity={"warning"}
            >{`¿Desea eliminar el cliente: ${selectedItem.nombre} ${selectedItem.apellidos} ?`}</Alert>
          ),
        })
          .then(() => {
            setMessage("warning", "¡Acción no disponible por el momento!");

            /* deleteClient(selectedItem)
              .then((response) => {
                if (response.status === 200) {
                  setMessage("success", "Cliente eliminado con éxito!");
                  setOpenInRowMenu(false);
                  setSelected([]);
                  setRefresh(refresh + 1);
                }
              })
              .catch((error) => {
                console.log("Error al eliminar el cliente", error);
                setMessage("error", "¡Ha ocurrido un error!");
              }); */
          })
          .catch(() => {});
      }
    }
  };

  const handleMultipleDeleteClick = () => {
    if (selected.length > 0) {
      const selectedItems = filteredClients.filter((client) =>
        selected.includes(client.id)
      );

      confirm({
        content: (
          <Alert
            severity={"warning"}
          >{`¿Desea eliminar los ${selected.length} clientes seleccionados?`}</Alert>
        ),
      })
        .then(() => {
          // Perform the deletion of multiple records
          Promise.all(
            selectedItems.map((selectedItem) => deleteClient(selectedItem))
          )
            .then((responses) => {
              const isSuccess = responses.every(
                (response) => response.status === 200
              );

              if (isSuccess) {
                setMessage(
                  "success",
                  `¡${selected.length} clientes eliminados con éxito!`
                );
                setOpenInRowMenu(false);
                setSelected([]);
                setRefresh(refresh + 1);
              } else {
                setMessage("warning", "¡Algún cliente no pudo ser eliminado!");
              }
            })
            .catch((error) => {
              console.log("Error al eliminar los clientes", error);
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
    setRowsNumber(CLIENTSLIST.length);
    setFilteredClients(
      applySortFilter(CLIENTSLIST, getComparator(order, orderBy), filterValue)
    );
    setIsNotFound(!filteredClients.length && !!filterValue);
  }, [CLIENTSLIST, filterValue, order, orderBy]);

  return (
    <>
      <Helmet>
        <title> Clients | REY-TECHTEST </title>
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
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Grid item>
              <Typography variant="h4" gutterBottom>
                Consulta de clientes
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                style={{ textTransform: "none", marginRight: "10px" }}
                startIcon={<Icon size={1} path={mdiPlus} />}
                onClick={() => {
                  setEditMode(false);
                  setIsFormVisible(true);
                  setFormData({});
                }}
              >
                Agregar
              </Button>
              <Button
                variant="contained"
                style={{ textTransform: "none" }}
                startIcon={<Icon size={1} path={mdiArrowLeft} />}
                onClick={() => {
                  history.push("/dashboard", {
                    state: { from: location },
                    replace: true,
                  });
                }}
              >
                Regresar
              </Button>
            </Grid>
          </Grid>

          <Card sx={{ maxHeight: "500px" }}>
            <ClientsListToolbar
              numSelected={selected.length}
              filterValue={filterValue}
              onFilterValue={handleFilterByValue}
              handleDelete={handleMultipleDeleteClick}
            />

            <Scrollbar>
              <TableContainer style={{ overflow: "auto" }}>
                <Table size="small">
                  <ClientsListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={CLIENTSLIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredClients
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        const { id, identificacion, nombre, apellidos } = row;
                        const selectedClient = selected.indexOf(id) !== -1;

                        return (
                          <TableRow
                            onClick={() => handleRowClick(id)}
                            hover
                            key={id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={selectedClient}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedClient}
                                onChange={(event) =>
                                  handleSelectClick(event, id)
                                }
                              />
                            </TableCell>

                            <TableCell align="left">{identificacion}</TableCell>

                            <TableCell align="left">
                              {String(nombre) + " " + String(apellidos)}
                            </TableCell>

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
                          Sin datos
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
            count={CLIENTSLIST.length}
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
