import { useTheme } from "@emotion/react";
import { Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";


function CoursesTable({courses}) {
    const theme = useTheme();
  return (
    <Paper sx={{ width: "100%", overflowX: "auto" }}>
      {courses.length === 0 ? (
        <Alert severity="warning">لا يوجد بيانات</Alert>
      ) : (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="upcoming table">
              <TableHead>
                <TableRow
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: theme.palette.primary.main,
                    zIndex: 1,
                  }}
                >
                  {[
                    "الإسم",
                    "الوصف",
                    "الفصل الدراسي",
                    "السعر",
                    "السنة",
                    "رقم المادة",
                    "رقم المعلم",
                    "رقم الملاحظة",
                    "الحالة",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        color: theme.palette.text.secondary,
                        fontWeight: 700,
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((item) => (
                  <TableRow  key={item.id}>
                    <TableCell onClick={() => handleItemClick(item.id)}>
                      {item.name}
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.term}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.year}</TableCell>
                    <TableCell>{item.materialId}</TableCell>
                    <TableCell>{item.teacherId}</TableCell>
                    <TableCell>{item.noteFieldId}</TableCell>
                    <TableCell>{item.active ? "Yes" : "No"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalUpcoming}
            rowsPerPage={limit}
            page={page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </>
      )}
    </Paper>
  );
}

export default CoursesTable;
