
// THIS FILE IS AUTO-GENERATED.
// DO NOT EDIT MANUALLY.

import CatalogNode from "../components/catalog-node";

import { EditorNodeDefinition } from "@/types/editor";

export const nodeRegistry: EditorNodeDefinition[] = [
  {
    "type": "aws.athena",
    "label": "aws-athena",
    "name": "Athena",
    "category": "AWS",
    "icon": "/icons/aws/Athena.svg"
  },
  {
    "type": "aws.cleanrooms",
    "label": "aws-cleanrooms",
    "name": "Clean-Rooms",
    "category": "AWS",
    "icon": "/icons/aws/Clean-Rooms.svg"
  },
  {
    "type": "aws.cloudsearch",
    "label": "aws-cloudsearch",
    "name": "CloudSearch",
    "category": "AWS",
    "icon": "/icons/aws/CloudSearch.svg"
  },
  {
    "type": "aws.dataexchange",
    "label": "aws-dataexchange",
    "name": "Data-Exchange",
    "category": "AWS",
    "icon": "/icons/aws/Data-Exchange.svg"
  },
  {
    "type": "aws.datapipeline",
    "label": "aws-datapipeline",
    "name": "Data-Pipeline",
    "category": "AWS",
    "icon": "/icons/aws/Data-Pipeline.svg"
  },
  {
    "type": "aws.datazone",
    "label": "aws-datazone",
    "name": "DataZone",
    "category": "AWS",
    "icon": "/icons/aws/DataZone.svg"
  },
  {
    "type": "aws.emr",
    "label": "aws-emr",
    "name": "EMR",
    "category": "AWS",
    "icon": "/icons/aws/EMR.svg"
  },
  {
    "type": "aws.finspace",
    "label": "aws-finspace",
    "name": "FinSpace",
    "category": "AWS",
    "icon": "/icons/aws/FinSpace.svg"
  },
  {
    "type": "aws.gluedatabrew",
    "label": "aws-gluedatabrew",
    "name": "Glue-DataBrew",
    "category": "AWS",
    "icon": "/icons/aws/Glue-DataBrew.svg"
  },
  {
    "type": "aws.glueelasticviews",
    "label": "aws-glueelasticviews",
    "name": "Glue-Elastic-Views",
    "category": "AWS",
    "icon": "/icons/aws/Glue-Elastic-Views.svg"
  },
  {
    "type": "aws.glue",
    "label": "aws-glue",
    "name": "Glue",
    "category": "AWS",
    "icon": "/icons/aws/Glue.svg"
  },
  {
    "type": "aws.kinesisdataanalytics",
    "label": "aws-kinesisdataanalytics",
    "name": "Kinesis-Data-Analytics",
    "category": "AWS",
    "icon": "/icons/aws/Kinesis-Data-Analytics.svg"
  },
  {
    "type": "aws.kinesisdatastreams",
    "label": "aws-kinesisdatastreams",
    "name": "Kinesis-Data-Streams",
    "category": "AWS",
    "icon": "/icons/aws/Kinesis-Data-Streams.svg"
  },
  {
    "type": "aws.kinesisfirehose",
    "label": "aws-kinesisfirehose",
    "name": "Kinesis-Firehose",
    "category": "AWS",
    "icon": "/icons/aws/Kinesis-Firehose.svg"
  },
  {
    "type": "aws.kinesisvideostreams",
    "label": "aws-kinesisvideostreams",
    "name": "Kinesis-Video-Streams",
    "category": "AWS",
    "icon": "/icons/aws/Kinesis-Video-Streams.svg"
  },
  {
    "type": "aws.kinesis",
    "label": "aws-kinesis",
    "name": "Kinesis",
    "category": "AWS",
    "icon": "/icons/aws/Kinesis.svg"
  },
  {
    "type": "aws.lakeformation",
    "label": "aws-lakeformation",
    "name": "Lake-Formation",
    "category": "AWS",
    "icon": "/icons/aws/Lake-Formation.svg"
  },
  {
    "type": "aws.managedstreamingforapachekafka",
    "label": "aws-managedstreamingforapachekafka",
    "name": "Managed-Streaming-for-Apache-Kafka",
    "category": "AWS",
    "icon": "/icons/aws/Managed-Streaming-for-Apache-Kafka.svg"
  },
  {
    "type": "aws.opensearchservice",
    "label": "aws-opensearchservice",
    "name": "OpenSearch-Service",
    "category": "AWS",
    "icon": "/icons/aws/OpenSearch-Service.svg"
  },
  {
    "type": "aws.quicksight",
    "label": "aws-quicksight",
    "name": "QuickSight",
    "category": "AWS",
    "icon": "/icons/aws/QuickSight.svg"
  },
  {
    "type": "aws.redshift",
    "label": "aws-redshift",
    "name": "Redshift",
    "category": "AWS",
    "icon": "/icons/aws/Redshift.svg"
  }
].map((node) => ({
  ...node,
  component: CatalogNode,
}));
