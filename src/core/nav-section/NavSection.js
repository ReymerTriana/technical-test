import { Icon } from "@mdi/react";
import PropTypes from "prop-types";
import { useState } from "react";
import { NavLink as RouterLink, useLocation } from "react-router-dom";
// @mui
import { Box, List, ListItemText } from "@mui/material";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
//
import { StyledNavItem, StyledNavItemIcon } from "./styles";

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
  onSubmenuItemClicked: PropTypes.func,
};

export default function NavSection({
  data = [],
  onSubmenuItemClicked,
  ...other
}) {
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <NavItem
            key={item.title}
            item={item}
            onSubmenuItemClicked={onSubmenuItemClicked}
          />
        ))}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
  onSubmenuItemClicked: PropTypes.func,
};

function NavItem({ item, onSubmenuItemClicked }) {
  const { pathname } = useLocation();
  const {
    title,
    path,
    icon,
    info,
    haveAccess,
    showSubItems,
    subItems,
    enabled,
  } = item;
  const [isExpanded, setIsExpanded] = useState(showSubItems);

  const ToggleShowSubItems = () => {
    setIsExpanded(!isExpanded);
  };

  const isActive = pathname === path;

  if (subItems && haveAccess) {
    return (
      <div>
        <StyledNavItem
          onClick={ToggleShowSubItems}
          sx={{
            color: isActive ? "text.primary" : "inherit",
            bgcolor: isActive ? "action.selected" : "inherit",
            fontWeight: isActive ? "fontWeightBold" : "inherit",
          }}
        >
          <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
          <ListItemText disableTypography primary={title} />
          {isExpanded ? (
            <Icon size={1} path={mdiChevronDown} />
          ) : (
            <Icon size={1} path={mdiChevronUp} />
          )}
        </StyledNavItem>
        {isExpanded && (
          <Box sx={{ pl: "20px" }}>
            <List>
              {subItems.map((subItem) => (
                <NavItem
                  key={subItem.title}
                  item={subItem}
                  onSubmenuItemClicked={onSubmenuItemClicked}
                />
              ))}
            </List>
          </Box>
        )}
      </div>
    );
  }

  return (
    <>
      {haveAccess && (
        <StyledNavItem
          component={path ? RouterLink : Box}
          to={path}
          sx={{
            color: isActive ? "text.primary" : "inherit",
            bgcolor: isActive ? "action.selected" : "inherit",
            fontWeight: isActive ? "fontWeightBold" : "inherit",
          }}
          onClick={() => onSubmenuItemClicked(title)}
          disabled={!enabled}
        >
          <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

          <ListItemText disableTypography primary={title} />

          {info && info}
        </StyledNavItem>
      )}
    </>
  );
}
