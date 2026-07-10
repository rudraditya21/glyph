import { EditorNodeDefinition } from "@/types/editor";
import CatalogNode from "../components/catalog-node";

export const awsNodes: EditorNodeDefinition[] = [
  {
    type: "aws.ec2",
    label: "EC2",
    category: "AWS",
    icon: "/icons/aws/ec2.svg",
    component: CatalogNode,
  },
]