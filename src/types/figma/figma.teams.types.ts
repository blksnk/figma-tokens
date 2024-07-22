// https://www.figma.com/developers/api#library-items

import {
  FigmaComponentKey,
  FigmaFileKey,
  FigmaNodeId,
  FigmaPageId,
  FigmaProjectId,
  FigmaStyleKey,
  FigmaUserId,
} from "./figma.properties.types";
import { FigmaStyleType } from "./figma.enums.types";

export type FigmaProject = {
  id: FigmaProjectId;
  name: string;
};

export type FigmaTeamUser = {
  /**
   * Unique stable id of the user
   */
  id: FigmaUserId;
  /**
   * Name of the user
   */
  handle: string;
  /**
   * URL link to the user's profile image
   */
  img_url: string;
  /**
   * Email associated with the user's account.
   * @remarks This will only be present on the /v1/me endpoint
   */
  email?: string;
};

/**
 * Data on the frame a component resides in
 */
export type FigmaFrameInfo = {
  /**
   * ID of the frame node within the file
   */
  nodeId: FigmaNodeId;
  /**
   * Name of the frame
   */
  name: string;
  /**
   * Background color of the frame
   */
  backgroundColor: string;
  /**
   * ID of the frame's residing page
   */
  pageId: FigmaPageId;
  /**
   * Name of the frame's residing page
   */
  pageName: string;
};

export type FigmaPageInfo = Record<string, never>;

/**
 * An arrangement of published UI elements that can be instantiated across figma files
 */
export type FigmaComponentMetadata = {
  /**
   * The unique identifier of the component
   */
  key: FigmaComponentKey;
  /**
   * The unique identifier of the figma file which contains the component
   */
  file_key: FigmaFileKey;
  /**
   * ID of the component node within the figma file
   */
  node_id: FigmaNodeId;
  /**
   * URL link to the component's thumbnail image
   */
  thumbnail_url: string;
  /**
   * Name of the component
   */
  name: string;
  /**
   * The description of the component as entered by the publisher
   */
  description: string;
  /**
   * The UTC ISO 8601 time at which the component was created
   */
  created_at: string;
  /**
   * The UTC ISO 8601 time at which the component was updated
   */
  updated_at: string;
  /**
   * The user who last updated the component
   */
  user: FigmaTeamUser;
  /**
   * Data on component's containing frame, if component resides within a frame
   * @default {}
   */
  containing_frame: FigmaFrameInfo | Record<string, never>;
  /**
   * Data on component's containing page, if component resides in a multi-page file
   * @default {}
   */
  containing_page: FigmaPageInfo;
};

export type FigmaComponentSetMetadata = FigmaComponentMetadata;

export type FigmaStyleMetadata = {
  /**
   * The unique identifier of the style
   */
  key: FigmaStyleKey;
  /**
   * The unique identifier of the figma file which contains the style
   */
  file_key: FigmaFileKey;
  /**
   * ID of the component node within the figma file
   */
  node_id: FigmaNodeId;
  /**
   * The type of style
   */
  style_type: FigmaStyleType;
  /**
   * URL link to the style's thumbnail image
   */
  thumbnail_url: string;
  /**
   * Name of the style
   */
  name: string;
  /**
   * The description of the style as entered by the publisher
   */
  description: string;
  /**
   * The UTC ISO 8601 time at which the style was created
   */
  created_at: string;
  /**
   * The UTC ISO 8601 time at which the style was updated
   */
  updated_at: string;
  /**
   * The user who last updated the component
   */
  user: FigmaTeamUser;
  /**
   * A user specified order number by which the style can be sorted
   */
  sort_position: `${number}`;
};
