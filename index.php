<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>DataGrid</title>
    <script src="app/angular.js"></script>
    <script src="app/cpDatagrid.js"></script>
    <link rel="stylesheet" href="app/datagrid.css"/>
    <?php
        $names = array('Mirek', 'Tomáš', 'Jiří', 'Honza', 'Pavel');
        $data = array();
        for ($i = 0; $i < 300; $i++) {
            $data[] = array('id' => $i, 'name' => $names[$i % count($names)], 'age' => rand(5, 50), 'grade' => rand(1, 5));
        }
        $config = array(
            'itemsPerPage' => 20,
            'columns'      =>
                array(
                    'id'    => array('identificator' => 'id',
                                     'label'         => 'Ajdíčko',
                                     'grouping'      => 'count'),
                    'name'  => array('identificator' => 'name',
                                     'label'         => 'Jméno',
                                     'grouping'      => 'concatenate'),
                    'age'   => array('identificator' => 'age',
                                     'label'         => 'Věk',
                                     'grouping'      => 'sum'),
                    'grade' => array('identificator' => 'grade',
                                     'label'         => 'Známka',
                                     'grouping'      => 'count'),
                )
        );
    ?>

</head>
<body>
<cp-datagrid data='<?php echo json_encode($data); ?>' config='<?php echo json_encode($config) ?>'></cp-datagrid>
<cp-datagrid data='<?php echo json_encode($data); ?>' config='<?php echo json_encode($config) ?>'></cp-datagrid>
</body>
</html>