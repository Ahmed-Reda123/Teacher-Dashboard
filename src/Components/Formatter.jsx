import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  FiSave,
  FiTrash2,
  FiImage,
  FiBold,
  FiItalic,
  FiList,
  FiLink,
  FiCode,
} from "react-icons/fi";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Close, Visibility, VisibilityOff } from "@mui/icons-material";

export const SimpleRichEditor = forwardRef(
  ({ value, onChange, placeholder, onRequestLink }, ref) => {
    const editorRef = useRef(null);
    const selectionRef = useRef(null);
    const [colorPickerOpen, setColorPickerOpen] = useState(false);
    const [currentColor, setCurrentColor] = useState("#000000");
    const colorPickerRef = useRef(null);
    const [selectedFormat, setSelectedFormat] = useState("");
    const [selectedFontSize, setSelectedFontSize] = useState("");

    useImperativeHandle(ref, () => ({
      saveSelection,
      restoreSelection,
      focus: () => editorRef.current?.focus(),
    }));

    const saveSelection = () => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        selectionRef.current = selection.getRangeAt(0);
      }
    };

    const restoreSelection = () => {
      if (selectionRef.current) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(selectionRef.current);
        editorRef.current?.focus();
      }
    };

    useLayoutEffect(() => {
      if (editorRef.current && value !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = value;
      }
      restoreSelection();
    }, [value]);

    const execFormatCommand = (command, val = null) => {
      document.execCommand(command, false, val);
      editorRef.current?.focus();
      onChange(editorRef.current?.innerHTML || "");
    };

    const fixListStyling = () => {
      if (editorRef.current) {
        const lists = editorRef.current.querySelectorAll("ul, ol");
        lists.forEach((list) => {
          if (!list.style.paddingRight) {
            Object.assign(list.style, {
              direction: "rtl",
              paddingRight: "1.5rem",
              paddingLeft: "0",
              marginRight: "0.5rem",
              marginLeft: "0",
              textAlign: "right",
              listStylePosition: "inside",
              listStyleType: "unset",
            });
          }

          const items = list.querySelectorAll("li");
          items.forEach((item) => {
            if (!item.style.direction) {
              Object.assign(item.style, {
                direction: "rtl",
                textAlign: "right",
                display: "list-item",
                marginBottom: "0.25rem",
              });
            }
          });
        });
      }
    };

    const handleFormat = (command, value = null) => {
      saveSelection();

      if (command === "formatBlock") {
        restoreSelection();
        document.execCommand(command, false, value);

        setTimeout(() => {
          if (editorRef.current) {
            const headings = editorRef.current.querySelectorAll(
              "h1, h2, h3, h4, h5, h6"
            );

            headings.forEach((heading) => {
              const tagNameToSize = {
                H1: "1.75rem",
                H2: "1.5rem",
                H3: "1.25rem",
                H4: "1.125rem",
                H5: "1rem",
                H6: "0.875rem",
              };

              const tagNameToWeight = {
                H1: "800",
                H2: "700",
                H3: "700",
                H4: "600",
                H5: "600",
                H6: "600",
              };

              Object.assign(heading.style, {
                fontWeight: tagNameToWeight[heading.tagName] || "bold",
                fontSize: tagNameToSize[heading.tagName] || "1rem",
                margin: heading.tagName.match(/H[1-3]/)
                  ? "1rem 0 0.5rem"
                  : "0.5rem 0",
                direction: "rtl",
                textAlign: "right",
                lineHeight: "1.2",
                color: "#111827",
                display: "block",
                width: "100%",
              });
            });

            onChange(editorRef.current.innerHTML);
            setSelectedFormat("");
          }
        }, 10);
        return;
      }

      if (
        command === "insertUnorderedList" ||
        command === "insertOrderedList"
      ) {
        restoreSelection();
        document.execCommand(command, false, value);

        setTimeout(() => {
          fixListStyling();
          onChange(editorRef.current.innerHTML);
        }, 0);
        return;
      }

      execFormatCommand(command, value);
    };

    const handleClearFormatting = () => {
      saveSelection();
      const selection = window.getSelection();

      if (selection.rangeCount > 0 && !selection.isCollapsed) {
        execFormatCommand("removeFormat");
        execFormatCommand("unlink");
        execFormatCommand("formatBlock", "div");

        const range = selection.getRangeAt(0);
        const text = range.toString();
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        selectionRef.current = range;
        onChange(editorRef.current?.innerHTML || "");
      } else {
        editorRef.current.innerHTML = "";
        onChange("");
      }
      editorRef.current?.focus();
    };

    const handleInput = () => {
      saveSelection();
      fixListStyling();
      onChange(editorRef.current?.innerHTML || "");
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const parentElement =
            selection.getRangeAt(0).startContainer.parentElement;

          if (
            parentElement &&
            (parentElement.tagName === "LI" || parentElement.closest("li"))
          ) {
            saveSelection();
            setTimeout(() => {
              fixListStyling();
              handleInput();
            }, 0);
            return;
          }

          e.preventDefault();
          const range = selection.getRangeAt(0);

          const br = document.createElement("br");
          range.insertNode(br);
          range.setStartAfter(br);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);

          const textNode = document.createTextNode("\u200B");
          range.insertNode(textNode);

          selection.removeAllRanges();
          selection.addRange(range);
          selectionRef.current = range;

          const parent = range.commonAncestorContainer.parentElement;
          if (parent.nodeName === "DIV" && parent.innerHTML === "<br>") {
            parent.innerHTML = "<br>\u200B";
          }

          onChange(editorRef.current?.innerHTML || "");
        }
      }
    };

    const handlePaste = (e) => {
      e.preventDefault();
      saveSelection();
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
      handleInput();
    };

    const handleLinkButtonClick = () => {
      saveSelection();
      editorRef.current?.focus();
      const selection = window.getSelection();
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      if (range) selectionRef.current = range;

      onRequestLink((url) => {
        restoreSelection();
        handleFormat("createLink", url);
        const links = editorRef.current?.querySelectorAll("a") || [];
        links.forEach((link) => {
          if (link.getAttribute("href") === url) {
            Object.assign(link.style, {
              color: "#3B82F6",
              textDecoration: "underline",
            });
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener noreferrer");
          }
        });
        onChange(editorRef.current?.innerHTML || "");
      });
    };

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          colorPickerRef.current &&
          !colorPickerRef.current.contains(event.target)
        ) {
          setColorPickerOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      if (editorRef.current) {
        const links = editorRef.current.querySelectorAll("a");
        links.forEach((link) => {
          Object.assign(link.style, {
            color: "#3B82F6",
            textDecoration: "underline",
          });
          link.setAttribute("target", "_blank");
          link.setAttribute("rel", "noopener noreferrer");
        });
      }
    }, [value]);

    const handleColorSelect = (color) => {
      saveSelection();
      setCurrentColor(color);
      handleFormat("foreColor", color);
      setColorPickerOpen(false);
    };

    const handleColorInputChange = (e) => {
      const newColor = e.target.value;
      setCurrentColor(newColor);
      saveSelection();
      handleFormat("foreColor", newColor);
    };

    const colorPalette = [
      "#000000",
      "#2563EB",
      "#DC2626",
      "#059669",
      "#D97706",
      "#7C3AED",
      "#4B5563",
      "#1D4ED8",
      "#9D174D",
      "#047857",
      "#B45309",
      "#6D28D9",
      "#6B7280",
      "#60A5FA",
      "#F87171",
      "#34D399",
      "#FBBF24",
      "#A78BFA",
    ];

    const handleEditorClick = () => {
      saveSelection();
      setTimeout(() => {
        fixListStyling();
      }, 0);
    };

    return (
      <Paper elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            p: 1,
            borderBottom: "1px solid #e0e0e0",
            bgcolor: "#fafafa",
          }}
        >
          {[
            { icon: FiBold, command: "bold", title: "Bold" },
            { icon: FiItalic, command: "italic", title: "Italic" },
            {
              icon: FiList,
              command: "insertUnorderedList",
              title: "قائمة نقطية",
            },
            {
              icon: () => <span style={{ fontWeight: "bold" }}>1.</span>,
              command: "insertOrderedList",
              title: "قائمة رقمية",
            },
            {
              icon: FiLink,
              onClick: handleLinkButtonClick,
              title: "إدراج رابط",
            },
          ].map((btn, idx) => (
            <Tooltip key={idx} title={btn.title}>
              <IconButton
                size="small"
                onClick={
                  btn.onClick || (() => handleFormat(btn.command, btn.value))
                }
                sx={{
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                {btn.icon ? <btn.icon size={16} /> : btn.text}
              </IconButton>
            </Tooltip>
          ))}

          <Select
            size="small"
            sx={{
              minWidth: 100,
              "& .MuiSelect-select": { py: 0.5 },
              ml: 1,
              direction: "rtl",
            }}
            value={selectedFormat}
            onChange={(e) => {
              if (e.target.value) {
                handleFormat("formatBlock", e.target.value);
              }
            }}
            displayEmpty
          >
            <MenuItem value="" disabled>
              التنسيق
            </MenuItem>
            <MenuItem value="<div>">فقرة</MenuItem>
            <MenuItem value="<h1>">عنوان 1</MenuItem>
            <MenuItem value="<h2>">عنوان 2</MenuItem>
            <MenuItem value="<h3>">عنوان 3</MenuItem>
            <MenuItem value="<h4>">عنوان 4</MenuItem>
            <MenuItem value="<h5>">عنوان 5</MenuItem>
            <MenuItem value="<h6>">عنوان 6</MenuItem>
          </Select>

          <Select
            size="small"
            sx={{
              minWidth: 120,
              "& .MuiSelect-select": { py: 0.5 },
              ml: 1,
              direction: "rtl",
            }}
            value={selectedFontSize}
            onChange={(e) => {
              if (e.target.value) {
                saveSelection();
                restoreSelection();
                document.execCommand("fontSize", false, e.target.value);

                setTimeout(() => {
                  if (editorRef.current) {
                    const fontElements = editorRef.current.querySelectorAll(
                      `font[size="${e.target.value}"]`
                    );
                    const fontSizeMap = {
                      1: "10px",
                      2: "12px",
                      3: "14px",
                      4: "16px",
                      5: "18px",
                      6: "24px",
                      7: "32px",
                    };

                    fontElements.forEach((element) => {
                      element.style.fontSize = fontSizeMap[e.target.value];
                    });

                    onChange(editorRef.current.innerHTML);
                    setSelectedFontSize("");
                  }
                }, 0);
              }
            }}
            displayEmpty
          >
            <MenuItem value="" disabled>
              حجم الخط
            </MenuItem>
            <MenuItem value="1">صغير جداً</MenuItem>
            <MenuItem value="2">صغير</MenuItem>
            <MenuItem value="3">عادي</MenuItem>
            <MenuItem value="4">متوسط</MenuItem>
            <MenuItem value="5">كبير</MenuItem>
            <MenuItem value="6">كبير جداً</MenuItem>
            <MenuItem value="7">ضخم</MenuItem>
          </Select>

          <Tooltip title="Clear Formatting">
            <IconButton
              size="small"
              onClick={handleClearFormatting}
              sx={{
                color: "error.main",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <FiTrash2 size={16} />
            </IconButton>
          </Tooltip>

          <Box ref={colorPickerRef} sx={{ position: "relative" }}>
            <Tooltip title="Text Color">
              <IconButton
                size="small"
                onClick={() => setColorPickerOpen(!colorPickerOpen)}
                sx={{
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: currentColor,
                    mr: 0.5,
                  }}
                />
              </IconButton>
            </Tooltip>
            {colorPickerOpen && (
              <Paper
                elevation={3}
                sx={{
                  position: "absolute",
                  zIndex: 10,
                  top: "100%",
                  right: 0,
                  width: 240,
                  p: 2,
                  mt: 1,
                }}
              >
                <Typography variant="subtitle2" sx={{ textAlign: "right" }}>
                  اختر اللون
                </Typography>
                <Grid container spacing={1} sx={{ my: 1 }}>
                  {colorPalette.map((color) => (
                    <Grid item key={color}>
                      <IconButton
                        size="small"
                        sx={{
                          p: 0,
                          "&:hover": { transform: "scale(1.1)" },
                        }}
                        onClick={() => handleColorSelect(color)}
                      >
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            bgcolor: color,
                            border: "2px solid",
                            borderColor: "background.paper",
                          }}
                        />
                      </IconButton>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <input
                    type="color"
                    value={currentColor}
                    onChange={handleColorInputChange}
                    style={{
                      width: 40,
                      height: 40,
                      border: "none",
                      cursor: "pointer",
                    }}
                  />
                  <TextField
                    size="small"
                    value={currentColor}
                    onChange={handleColorInputChange}
                    sx={{
                      width: 100,
                      "& .MuiInputBase-input": { textAlign: "right" },
                    }}
                  />
                </Box>
              </Paper>
            )}
          </Box>
        </Box>
        <Box
          ref={editorRef}
          contentEditable
          sx={{
            p: 2,
            minHeight: 300,
            outline: "none",
            overflowY: "auto",
            direction: "rtl",
            fontSize: "14px",
            fontFamily: "Arial, sans-serif",
            "&:empty:not(:focus):before": {
              content: "attr(placeholder)",
              color: "#9ca3af",
              fontStyle: "italic",
              direction: "rtl",
              textAlign: "right",
            },
          }}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={saveSelection}
          onBlur={saveSelection}
          onMouseUp={saveSelection}
          onClick={handleEditorClick}
          placeholder={placeholder}
        />
      </Paper>
    );
  }
);

const MarketingEditor = ({
  initialContent = "",
  onSave,
  onDelete,
  loading,
}) => {
  const [content, setContent] = useState(initialContent);
  const [preview, setPreview] = useState(initialContent);
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [imageUploadModal, setImageUploadModal] = useState(false);
  const [imageBase64, setImageBase64] = useState("");
  const [linkModal, setLinkModal] = useState({ isOpen: false, callback: null });
  const [htmlModal, setHtmlModal] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [inputHtml, setInputHtml] = useState("");
  const [showSideBySide, setShowSideBySide] = useState(true);
  const editorRef = useRef(null);

  useEffect(() => setContent(initialContent), [initialContent]);

  useEffect(() => {
    setPreview(content);
  }, [content]);

  const handleContentChange = (value) => {
    editorRef.current?.saveSelection();
    setContent(value);
  };

  const handleSave = () => onSave(content);
  const handlePreview = () => {
    setPreview(content);
    setIsPreviewActive(true);
  };
  const closePreview = () => setIsPreviewActive(false);
  const toggleSideBySide = () => setShowSideBySide(!showSideBySide);

  const handleImageUpload = () => {
    editorRef.current?.saveSelection();
    setImageUploadModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImageBase64(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const insertImage = () => {
    if (imageBase64) {
      editorRef.current?.restoreSelection();
      setContent(
        (prev) =>
          prev +
          `<img src="${imageBase64}" alt="Uploaded image" style="max-width: 100%;" />`
      );
    }
    setImageBase64("");
    setImageUploadModal(false);
  };

  const handleRequestLink = (callback) => {
    editorRef.current?.saveSelection();
    setInputUrl("");
    setLinkModal({ isOpen: true, callback });
  };

  const handleInsertLink = () => {
    if (inputUrl.trim() && linkModal.callback) {
      linkModal.callback(inputUrl);
    }
    setLinkModal({ isOpen: false, callback: null });
  };

  const handleHtmlButtonClick = () => {
    editorRef.current?.saveSelection();
    setInputHtml("");
    setHtmlModal(true);
  };

  const handleInsertHtml = () => {
    if (inputHtml.trim()) {
      editorRef.current?.restoreSelection();
      setContent((prev) => prev + inputHtml);
    }
    setHtmlModal(false);
    setTimeout(() => editorRef.current?.focus(), 0);
  };

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          onClick={toggleSideBySide}
          startIcon={showSideBySide ? <Close /> : <Visibility />}
          sx={{ color: "primary.main" }}
        >
          {showSideBySide ? "إخفاء المعاينة" : "إظهار المعاينة"}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Editor Column */}
        <Grid item xs={12} lg={showSideBySide ? 6 : 12}>
          <Typography variant="subtitle2" gutterBottom>
            محتوى
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                p: 1,
                border: "1px solid",
                borderColor: "divider",
                borderBottom: "none",
                bgcolor: "background.default",
                borderRadius: "4px 4px 0 0",
              }}
            >
              <Button
                startIcon={<FiImage />}
                onClick={handleImageUpload}
                size="small"
              >
                إضافة صورة
              </Button>
              <Button
                startIcon={<FiCode />}
                onClick={handleHtmlButtonClick}
                size="small"
              >
                إضافة HTML
              </Button>
            </Box>
            <SimpleRichEditor
              ref={editorRef}
              value={content}
              onChange={handleContentChange}
              placeholder="أدخل المحتوى التسويقي هنا..."
              onRequestLink={handleRequestLink}
            />
          </Box>
        </Grid>

        {/* Live Preview Column */}
        {showSideBySide && (
          <Grid item xs={12} lg={6}>
            <Typography variant="subtitle2" gutterBottom>
              معاينة مباشرة
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                minHeight: 300,
                overflowY: "auto",
                bgcolor: "background.default",
              }}
            >
              {preview ? (
                <Box
                  dir="rtl"
                  dangerouslySetInnerHTML={{ __html: preview }}
                  sx={{
                    "& img": { maxWidth: "100%", height: "auto" },
                    "& h1": {
                      fontSize: "1.75rem !important",
                      fontWeight: "800 !important",
                      margin: "1.25rem 0 0.75rem !important",
                      direction: "rtl !important",
                      textAlign: "right !important",
                      color: "#111827 !important",
                      lineHeight: "1.2 !important",
                      display: "block !important",
                      width: "100% !important",
                    },
                    "& h2": {
                      fontSize: "1.5rem !important",
                      fontWeight: "700 !important",
                      margin: "1.25rem 0 0.75rem !important",
                      direction: "rtl !important",
                      textAlign: "right !important",
                      color: "#1f2937 !important",
                      lineHeight: "1.2 !important",
                      display: "block !important",
                      width: "100% !important",
                    },
                    "& h3": {
                      fontSize: "1.25rem !important",
                      fontWeight: "700 !important",
                      margin: "1rem 0 0.5rem !important",
                      direction: "rtl !important",
                      textAlign: "right !important",
                      color: "#1f2937 !important",
                      lineHeight: "1.3 !important",
                      display: "block !important",
                      width: "100% !important",
                    },
                    "& h4": {
                      fontSize: "1.125rem !important",
                      fontWeight: "600 !important",
                      margin: "0.75rem 0 0.5rem !important",
                      direction: "rtl !important",
                      textAlign: "right !important",
                      color: "#374151 !important",
                      lineHeight: "1.3 !important",
                      display: "block !important",
                      width: "100% !important",
                    },
                    "& h5": {
                      fontSize: "1rem !important",
                      fontWeight: "600 !important",
                      margin: "0.75rem 0 0.5rem !important",
                      direction: "rtl !important",
                      textAlign: "right !important",
                      color: "#4b5563 !important",
                      lineHeight: "1.4 !important",
                      display: "block !important",
                      width: "100% !important",
                    },
                    "& h6": {
                      fontSize: "0.875rem !important",
                      fontWeight: "600 !important",
                      margin: "0.5rem 0 0.25rem !important",
                      direction: "rtl !important",
                      textAlign: "right !important",
                      color: "#4b5563 !important",
                      lineHeight: "1.4 !important",
                      display: "block !important",
                      width: "100% !important",
                    },
                    "& ul": {
                      listStyleType: "disc !important",
                      paddingRight: "2rem !important",
                      paddingLeft: "0 !important",
                      margin: "0.75rem 0 !important",
                      direction: "rtl !important",
                      display: "block !important",
                    },
                    "& ol": {
                      listStyleType: "decimal !important",
                      paddingRight: "2rem !important",
                      paddingLeft: "0 !important",
                      margin: "0.75rem 0 !important",
                      direction: "rtl !important",
                      display: "block !important",
                    },
                    "& li": {
                      display: "list-item !important",
                      marginBottom: "0.5rem !important",
                      direction: "rtl !important",
                      textAlign: "right !important",
                    },
                  }}
                />
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", fontStyle: "italic" }}
                >
                  ابدأ بالكتابة لرؤية المعاينة هنا
                </Typography>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          mt: 3,
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handlePreview}
            sx={{ borderColor: "primary.light", color: "primary.dark" }}
          >
            معاينة كاملة
          </Button>
          {initialContent && (
            <Button
              variant="outlined"
              color="error"
              onClick={onDelete}
              startIcon={<FiTrash2 />}
              sx={{ borderColor: "error.light", color: "error.dark" }}
            >
              حذف المحتوى
            </Button>
          )}
        </Box>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <FiSave />
            )
          }
        >
          {loading ? "جاري الحفظ..." : "حفظ المحتوى"}
        </Button>
      </Box>

      {/* Link Dialog */}
      <Dialog
        open={linkModal.isOpen}
        onClose={() => setLinkModal({ isOpen: false, callback: null })}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <FiLink style={{ marginLeft: 8 }} />
            إضافة رابط
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="url"
            label="أدخل الرابط"
            type="url"
            fullWidth
            variant="outlined"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://example.com"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setLinkModal({ isOpen: false, callback: null })}
            color="inherit"
          >
            إلغاء
          </Button>
          <Button onClick={handleInsertLink} color="primary" variant="contained">
            إدراج الرابط
          </Button>
        </DialogActions>
      </Dialog>

      {/* HTML Dialog */}
      <Dialog open={htmlModal} onClose={() => setHtmlModal(false)}>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <FiCode style={{ marginLeft: 8 }} />
            إضافة كود HTML
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="html"
            label="أدخل كود HTML"
            multiline
            rows={5}
            fullWidth
            variant="outlined"
            value={inputHtml}
            onChange={(e) => setInputHtml(e.target.value)}
            placeholder="<div class='example'>المحتوى</div>"
            sx={{ mt: 2, fontFamily: "monospace" }}
          />
          <Typography variant="caption" color="text.secondary">
            يمكنك إدراج أي كود HTML مثل الجداول، العناوين، أو أي تنسيق متقدم.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHtmlModal(false)} color="inherit">
            إلغاء
          </Button>
          <Button onClick={handleInsertHtml} color="primary" variant="contained">
            إدراج HTML
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog
        open={imageUploadModal}
        onClose={() => {
          setImageBase64("");
          setImageUploadModal(false);
          setTimeout(() => editorRef.current?.focus(), 0);
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <FiImage style={{ marginLeft: 8 }} />
            إضافة صورة
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              accept="image/*"
              id="image-upload"
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="image-upload">
              <Button
                variant="contained"
                component="span"
                color="primary"
                fullWidth
              >
                اختر صورة
              </Button>
            </label>
          </Box>
          {imageBase64 && (
            <Box sx={{ mt: 3, border: 1, borderColor: "divider", p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                معاينة:
              </Typography>
              <Box
                component="img"
                src={imageBase64}
                alt="Preview"
                sx={{ maxHeight: 160, maxWidth: "100%", mx: "auto" }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setImageBase64("");
              setImageUploadModal(false);
              setTimeout(() => editorRef.current?.focus(), 0);
            }}
            color="inherit"
          >
            إلغاء
          </Button>
          <Button
            onClick={insertImage}
            color="primary"
            variant="contained"
            disabled={!imageBase64}
          >
            إدراج الصورة
          </Button>
        </DialogActions>
      </Dialog>

      {/* Full Preview Dialog */}
      <Dialog
        open={isPreviewActive}
        onClose={closePreview}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            معاينة المحتوى
            <IconButton onClick={closePreview}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              p: 3,
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              bgcolor: "background.default",
            }}
          >
            <div
              dir="rtl"
              dangerouslySetInnerHTML={{ __html: content }}
              style={{
                "& img": { maxWidth: "100%", height: "auto" },
                "& h1": {
                  fontSize: "1.75rem !important",
                  fontWeight: "800 !important",
                  margin: "1.25rem 0 0.75rem !important",
                  direction: "rtl !important",
                  textAlign: "right !important",
                  color: "#111827 !important",
                  lineHeight: "1.2 !important",
                  display: "block !important",
                  width: "100% !important",
                },
                "& h2": {
                  fontSize: "1.5rem !important",
                  fontWeight: "700 !important",
                  margin: "1.25rem 0 0.75rem !important",
                  direction: "rtl !important",
                  textAlign: "right !important",
                  color: "#1f2937 !important",
                  lineHeight: "1.2 !important",
                  display: "block !important",
                  width: "100% !important",
                },
                "& h3": {
                  fontSize: "1.25rem !important",
                  fontWeight: "700 !important",
                  margin: "1rem 0 0.5rem !important",
                  direction: "rtl !important",
                  textAlign: "right !important",
                  color: "#1f2937 !important",
                  lineHeight: "1.3 !important",
                  display: "block !important",
                  width: "100% !important",
                },
                "& h4": {
                  fontSize: "1.125rem !important",
                  fontWeight: "600 !important",
                  margin: "0.75rem 0 0.5rem !important",
                  direction: "rtl !important",
                  textAlign: "right !important",
                  color: "#374151 !important",
                  lineHeight: "1.3 !important",
                  display: "block !important",
                  width: "100% !important",
                },
                "& h5": {
                  fontSize: "1rem !important",
                  fontWeight: "600 !important",
                  margin: "0.75rem 0 0.5rem !important",
                  direction: "rtl !important",
                  textAlign: "right !important",
                  color: "#4b5563 !important",
                  lineHeight: "1.4 !important",
                  display: "block !important",
                  width: "100% !important",
                },
                "& h6": {
                  fontSize: "0.875rem !important",
                  fontWeight: "600 !important",
                  margin: "0.5rem 0 0.25rem !important",
                  direction: "rtl !important",
                  textAlign: "right !important",
                  color: "#4b5563 !important",
                  lineHeight: "1.4 !important",
                  display: "block !important",
                  width: "100% !important",
                },
                "& ul": {
                  listStyleType: "disc !important",
                  paddingRight: "2rem !important",
                  paddingLeft: "0 !important",
                  margin: "0.75rem 0 !important",
                  direction: "rtl !important",
                  display: "block !important",
                },
                "& ol": {
                  listStyleType: "decimal !important",
                  paddingRight: "2rem !important",
                  paddingLeft: "0 !important",
                  margin: "0.75rem 0 !important",
                  direction: "rtl !important",
                  display: "block !important",
                },
                "& li": {
                  display: "list-item !important",
                  marginBottom: "0.5rem !important",
                  direction: "rtl !important",
                  textAlign: "right !important",
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePreview} variant="outlined">
            إغلاق
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default MarketingEditor;