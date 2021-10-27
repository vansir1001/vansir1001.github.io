import { User } from "./search-panel";
import { Dropdown, Table, TableProps, Menu } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Pin } from "../../components/pin";
import { useEditProject } from "../../utils/project";
import { ButtonNoPadding } from "../../components/lib";
import { useProjectModal } from "./util";

export interface Project {
  id: number;
  name: string;
  personId: number;
  pin: boolean;
  organization: string;
  created: number;
}
interface ListProps extends TableProps<Project> {
  users: User[];
}
export const List = ({ users, ...props }: ListProps) => {
  const { open, startEdit } = useProjectModal();
  const { mutate } = useEditProject();
  const pinProject = (id: number) => (pin: boolean) => mutate({ id, pin });
  const editProject = (id: number) => () => startEdit(id);
  const columns = [
    {
      title: <Pin checked={true} disabled={true} />,
      render(arg1: null, project: Project) {
        return (
          <Pin onCheckedChange={pinProject(project.id)} checked={project.pin} />
        );
      },
    },
    {
      dataIndex: "name",
      title: "名称",
      sorter: (a: Project, b: Project) => a.name.localeCompare(b.name),
      render(name: string, project: Project) {
        return <Link to={String(project.id)}>{name}</Link>;
      },
    },
    {
      dataIndex: "organization",
      title: "部门",
    },
    {
      dataIndex: "personId",
      title: "负责人",
      render: (personId: number) =>
        users.find((item1) => item1.id === personId)?.name ?? "未知",
    },
    {
      dataIndex: "created",
      title: "创建时间",
      render: (created: number) =>
        created ? dayjs(created).format("YYYY-MM-DD") : "无",
    },
    {
      render(value: undefined, project: Project) {
        return (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="edit" onClick={editProject(project.id)}>
                  编辑
                </Menu.Item>
                <Menu.Item key="delete">删除</Menu.Item>
              </Menu>
            }
          >
            <ButtonNoPadding type="link">...</ButtonNoPadding>
          </Dropdown>
        );
      },
    },
  ];
  return <Table rowKey="id" pagination={false} columns={columns} {...props} />;
};
