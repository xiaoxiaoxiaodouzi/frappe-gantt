export default {
  'code': 0,
  'data': [
    {
      'workorderId': 'Project Plan',
      'isParent': true,
      'startDate': '2024-05-19T00:00:00',
      'endDate': '2024-05-29T23:59:59',
      'duration': 11
    },
    {
      'workorderId': 'Project Preparation',
      'startDate': '2024-05-27T00:00:00',
      'endDate': '2024-05-29T23:59:58',
      'duration': 3,
      'isParent': true,
      'children': [
        {
          'workorderId': 'WO-0000088221',
          'vendorId': 'V00006DA4',
          'requestType': 6,
          'status': 3,
          'subStatus': 30,
          'serviceCategory': {
            'serviceCategoryId': 24,
            'name': 'Lock and KEY'
          },
          'serviceType': {
            'serviceTypeId': 109,
            'name': 'Rekey Cylinders'
          },
          'serviceCode': {
            'serviceCodeId': 271,
            'name': 'Rekey Cylinders'
          },
          'startDate': '2024-05-21T00:00:00',
          'endDate': '2024-05-24T23:59:58',
          'estimateCompletionDate': '2024-05-28T15:59:59',
          'vendorScheduledVisitStartDate': '2024-05-27T16:00:00Z',
          'vendorScheduledVisitEndDate': null,
          'vendorLocalScheduledVisitStartDate': '2024-05-27',
          'vendorLocalScheduledVisitEndDate': null,
          'dependOnWorkorders': [],
          'isDependency': false,
          'vendorName': 'kelly.shu12387',
          'vendorPhone': '(233) 333-3333',
          'subStatusValue': 'Completed',
          'statusValue': 'Completed',
          'requestTypeValue': 'Rekey',
          'serviceCombos': 'Lock and KEY-Rekey Cylinders-Rekey Cylinders',
          'workorderStatus': {
            'id': 3,
            'value': 'Completed'
          },
          'duration': 4,
          'isNeedWarning': false,
          'earliestStartDate': null,
          'nonDependentWorkorders': [
            'WO-0000088316',
            'WO-0000088318',
            'WO-0000088317'
          ]
        },
        {
          'workorderId': 'WO-0000088222',
          'vendorId': 'V00006DA4',
          'requestType': 11,
          'status': 3,
          'subStatus': 30,
          'serviceCategory': {
            'serviceCategoryId': 28,
            'name': 'Home Inspection'
          },
          'serviceType': {
            'serviceTypeId': 178,
            'name': 'Scope Walk'
          },
          'serviceCode': {
            'serviceCodeId': 528,
            'name': 'Other'
          },
          'startDate': '2024-05-27T00:00:00',
          'endDate': '2024-05-29T23:59:58',
          'estimateCompletionDate': '2024-05-28T15:59:59',
          'vendorScheduledVisitStartDate': '2024-05-27T16:00:00Z',
          'vendorScheduledVisitEndDate': null,
          'vendorLocalScheduledVisitStartDate': '2024-05-27',
          'vendorLocalScheduledVisitEndDate': null,
          'dependOnWorkorders': [],
          'isDependency': false,
          'vendorName': 'kelly.shu12387',
          'vendorPhone': '(233) 333-3333',
          'subStatusValue': 'Completed',
          'statusValue': 'Completed',
          'requestTypeValue': 'Scope Walk',
          'serviceCombos': 'Home Inspection-Scope Walk-Other',
          'workorderStatus': {
            'id': 3,
            'value': 'Completed'
          },
          'duration': 3,
          'isNeedWarning': false,
          'earliestStartDate': null,
          'dependOnWorkorders': [
            {
              'workorderId': 'WO-0000088221',
              'estimateCompletionDate': null,
              'endDate': '2024-05-20T00:00:00',
              'status': 2,
              'subStatus': 20,
              'relationType': 88
            }
          ],
          'nonDependentWorkorders': [
            'WO-0000088316',
            'WO-0000088318',
            'WO-0000088317'
          ]
        }
      ]
    },
    {
      'workorderId': 'Maintenance WO',
      'isParent': true,
      'startDate': '2024-05-19T00:00:00',
      'endDate': '2024-05-20T23:59:59',
      'duration': 2,
      'children': [
        {
          'workorderId': 'WO-0000088317',
          'vendorId': null,
          'requestType': 9,
          'status': 2,
          'subStatus': 20,
          'serviceCategory': {
            'serviceCategoryId': 30,
            'name': 'Accounting Adjustment'
          },
          'serviceType': {
            'serviceTypeId': 167,
            'name': 'Credit'
          },
          'serviceCode': {
            'serviceCodeId': 444,
            'name': 'Customer Credit'
          },
          'startDate': '2024-05-19T00:00:00',
          'endDate': '2024-05-20T23:59:59',
          'estimateCompletionDate': null,
          'vendorScheduledVisitStartDate': null,
          'vendorScheduledVisitEndDate': null,
          'vendorLocalScheduledVisitStartDate': null,
          'vendorLocalScheduledVisitEndDate': null,
          'dependOnWorkorders': [],
          'isDependency': false,
          'subStatusValue': 'AwaitingDispatchToVendor',
          'statusValue': 'In Progress',
          'requestTypeValue': 'Maintenance',
          'serviceCombos': 'Accounting Adjustment-Credit-Customer Credit',
          'workorderStatus': {
            'id': 2,
            'value': 'In Progress'
          },
          'duration': 2,
          'isNeedWarning': false,
          'earliestStartDate': '2024-05-29T23:59:58',
          'nonDependentWorkorders': [
            'WO-0000088318'
          ]
        }
      ]
    },
    {
      'workorderId': 'Quality Walk',
      'isParent': true,
      'startDate': '2024-05-21T00:00:00',
      'endDate': '2024-05-29T23:59:59',
      'duration': 9,
      'children': [
        {
          'workorderId': 'WO-0000088316',
          'vendorId': null,
          'requestType': 13,
          'status': 2,
          'subStatus': 20,
          'serviceCategory': {
            'serviceCategoryId': 28,
            'name': 'Home Inspection'
          },
          'serviceType': {
            'serviceTypeId': 181,
            'name': 'Quality WO'
          },
          'serviceCode': {
            'serviceCodeId': 531,
            'name': 'Other'
          },
          'startDate': '2024-05-21T00:00:00',
          'endDate': '2024-05-23T23:59:58',
          'estimateCompletionDate': null,
          'vendorScheduledVisitStartDate': null,
          'vendorScheduledVisitEndDate': null,
          'vendorLocalScheduledVisitStartDate': null,
          'vendorLocalScheduledVisitEndDate': null,
          'dependOnWorkorders': [
            {
              'workorderId': 'WO-0000088317',
              'estimateCompletionDate': null,
              'endDate': '2024-05-20T00:00:00',
              'status': 2,
              'subStatus': 20,
              'relationType': 88
            }
          ],
          'isDependency': true,
          'subStatusValue': 'AwaitingDispatchToVendor',
          'statusValue': 'In Progress',
          'requestTypeValue': 'Quality Walk',
          'serviceCombos': 'Home Inspection-Quality WO-Other',
          'workorderStatus': {
            'id': 2,
            'value': 'In Progress'
          },
          'duration': 3,
          'isNeedWarning': false,
          'earliestStartDate': '2024-05-20T00:00:00',
          'nonDependentWorkorders': []
        },
        {
          'workorderId': 'WO-0000088318',
          'vendorId': null,
          'requestType': 13,
          'status': 2,
          'subStatus': 20,
          'serviceCategory': {
            'serviceCategoryId': 28,
            'name': 'Home Inspection'
          },
          'serviceType': {
            'serviceTypeId': 181,
            'name': 'Quality WO'
          },
          'serviceCode': {
            'serviceCodeId': 531,
            'name': 'Other'
          },
          'startDate': '2024-05-27T00:00:00',
          'endDate': '2024-05-29T23:59:59',
          'estimateCompletionDate': null,
          'vendorScheduledVisitStartDate': null,
          'vendorScheduledVisitEndDate': null,
          'vendorLocalScheduledVisitStartDate': null,
          'vendorLocalScheduledVisitEndDate': null,
          'dependOnWorkorders': [],
          'isDependency': false,
          'subStatusValue': 'AwaitingDispatchToVendor',
          'statusValue': 'In Progress',
          'requestTypeValue': 'Quality Walk',
          'serviceCombos': 'Home Inspection-Quality WO-Other',
          'workorderStatus': {
            'id': 2,
            'value': 'In Progress'
          },
          'duration': 3,
          'isNeedWarning': false,
          'earliestStartDate': null,
          'nonDependentWorkorders': []
        }
      ]
    }
  ]
}

