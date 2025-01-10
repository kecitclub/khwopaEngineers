import React from 'react';
import { Table } from 'antd';

const VehicleTable = ({ vehicleData }) => {
  // Define columns based on the vehicle form fields
  const columns = [
    {
      title: 'Chassis Number',
      dataIndex: 'chasis_number',
      key: 'chasis_number',
    },
    {
      title: 'Engine Number',
      dataIndex: 'engine_number',
      key: 'engine_number',
    },
    {
      title: 'Company Name',
      dataIndex: 'company_name',
      key: 'company_name',
    },
    {
      title: 'Model Number',
      dataIndex: 'model_number',
      key: 'model_number',
    },
    {
      title: 'Build Year',
      dataIndex: 'build_year',
      key: 'build_year',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: 'Cylinder No',
      dataIndex: 'cylinder_no',
      key: 'cylinder_no',
    },
    {
      title: 'Horse Power',
      dataIndex: 'horse_power',
      key: 'horse_power',
    },
    {
      title: 'Seat Capacity',
      dataIndex: 'seat_capacity',
      key: 'seat_capacity',
    },
    {
      title: 'Fuel Type',
      dataIndex: 'fuel_type',
      key: 'fuel_type',
    },
    {
      title: 'Use Type',
      dataIndex: 'use_type',
      key: 'use_type',
    },
    {
      title: 'Number Plate',
      dataIndex: 'number_plate',
      key: 'number_plate',
    },
    {
      title: 'Darta Miti',
      dataIndex: 'darta_miti',
      key: 'darta_miti',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={vehicleData}
      rowKey="chasis_number" // Use unique field as the row key
      pagination={{ pageSize: 5 }}
    />
  );
};

export default VehicleTable;
