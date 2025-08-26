import React, { FC, useState, useEffect, useCallback } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Checkbox,
  Divider,
  Tag,
  Space,
  message,
  Select,
  AutoComplete,
} from "antd";
import {
  MailOutlined,
  UserOutlined,
  DeleteOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { sendBulkAnnouncement } from "actions/mail.action";
import {
  getUserEmailsByRoles,
  searchUsers,
  getAllClubMembers,
} from "actions/user.action";
import { Role, MembershipLevel } from "interfaces/user.interface";

const { TextArea } = Input;
const { Option } = AutoComplete;

interface EmailFormData {
  header: string;
  subject: string;
  body: string;
  manualEmails: string;
}

interface SearchOption {
  value: string;
  label: string;
}

const Email: FC = () => {
  const [form] = Form.useForm<EmailFormData>();
  const [emailLoading, setEmailLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [manualEmails, setManualEmails] = useState<string[]>([]);
  const [emailSearchValue, setEmailSearchValue] = useState("");
  const [emailSearchOptions, setEmailSearchOptions] = useState<SearchOption[]>(
    []
  );
  const [roleEmailCount, setRoleEmailCount] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [roleEmails, setRoleEmails] = useState<string[]>([]); // Track emails from roles

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm.length < 2) {
        setEmailSearchOptions([]);
        setSearchLoading(false);
        return;
      }

      try {
        const response = await searchUsers(searchTerm, 10);
        const options = response.data.users.map((user) => {
          const isAlreadyIncluded = roleEmails.includes(user.email);
          return {
            value: user.email,
            label: `${user.firstName} ${user.lastName} (${user.email})${
              isAlreadyIncluded ? " - Already included from role selection" : ""
            }`,
            disabled: isAlreadyIncluded, // Disable if already included
          };
        });
        setEmailSearchOptions(options);
      } catch (error) {
        console.error("Failed to search users:", error);
        setEmailSearchOptions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300),
    [roleEmails] // Add roleEmails as dependency
  );

  // Role selection handlers
  const handleRoleChange = async (checkedRoles: Role[]) => {
    setSelectedRoles(checkedRoles);

    // Fetch email count for selected roles to show in summary
    if (checkedRoles.length > 0) {
      try {
        let roleEmailsResponse;

        // If only "All Club Members" is selected, use the specific endpoint
        if (checkedRoles.length === 1 && checkedRoles[0] === Role.USER) {
          roleEmailsResponse = await getAllClubMembers();
        } else {
          // For other combinations, use the general roles endpoint
          roleEmailsResponse = await getUserEmailsByRoles(checkedRoles);
        }

        const emailCount = roleEmailsResponse.data.emails.length;
        setRoleEmailCount(emailCount);
        setRoleEmails(roleEmailsResponse.data.emails); // Store role emails

        // Show warning if no emails found
        if (emailCount === 0) {
          message.warning(
            `No users found with the selected role(s): ${checkedRoles.join(
              ", "
            )}. You may need to assign users to these roles first.`
          );
        }
      } catch (error) {
        console.error("Failed to fetch role email count:", error);
        setRoleEmailCount(0);
        setRoleEmails([]); // Clear role emails on error
        message.error("Failed to fetch user emails for selected roles");
      }
    } else {
      setRoleEmailCount(0);
      setRoleEmails([]); // Clear role emails when no roles selected
    }
  };

  // Manual email management
  const handleAddManualEmail = (email: string) => {
    if (!email.trim()) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      message.error("Please enter a valid email address");
      return;
    }

    // Check if email is already in manual emails
    if (manualEmails.includes(email)) {
      message.warning("Email already added manually");
      return;
    }

    // Check if email is already included from role selection
    if (roleEmails.includes(email)) {
      message.warning(
        "This email is already included from the selected role(s)"
      );
      return;
    }

    setManualEmails([...manualEmails, email]);
    setEmailSearchValue("");
  };

  const handleRemoveManualEmail = (emailToRemove: string) => {
    setManualEmails(manualEmails.filter((email) => email !== emailToRemove));
  };

  // Search functionality with debouncing
  const handleEmailSearch = (value: string) => {
    setEmailSearchValue(value);
    setSearchLoading(true);
    debouncedSearch(value);
  };

  const handleEmailSelect = (value: string) => {
    handleAddManualEmail(value);
  };

  // Form submission
  const handleSubmit = async (values: EmailFormData) => {
    setEmailLoading(true);

    try {
      // Collect all recipient emails
      let recipientEmails: string[] = [...manualEmails];

      // Fetch emails for selected roles
      if (selectedRoles.length > 0) {
        try {
          let roleEmailsResponse;

          // If only "All Club Members" is selected, use the specific endpoint
          if (selectedRoles.length === 1 && selectedRoles[0] === Role.USER) {
            roleEmailsResponse = await getAllClubMembers();
          } else {
            // For other combinations, use the general roles endpoint
            roleEmailsResponse = await getUserEmailsByRoles(selectedRoles);
          }

          const roleEmails = roleEmailsResponse.data.emails;

          // Add role-based emails to recipients
          recipientEmails.push(...roleEmails);

          // Remove duplicates
          recipientEmails = [...new Set(recipientEmails)];

          console.log(
            `Fetched ${
              roleEmails.length
            } emails for roles: ${selectedRoles.join(", ")}`
          );
        } catch (error) {
          console.error("Failed to fetch emails by roles:", error);
          message.error("Failed to fetch recipient emails. Please try again.");
          return;
        }
      }

      if (recipientEmails.length === 0) {
        message.warning(
          "No recipients found. Please select roles or add manual email addresses."
        );
        return;
      }

      // Send bulk announcement
      await sendBulkAnnouncement({
        emails: recipientEmails,
        header: values.header,
        subject: values.subject,
        body: values.body,
      });

      message.success(
        `Email sent successfully to ${recipientEmails.length} recipient(s)!`
      );

      // Reset form and state
      form.resetFields();
      setManualEmails([]);
      setSelectedRoles([]);
      setRoleEmailCount(0);
      setRoleEmails([]); // Clear role emails
    } catch (error: any) {
      console.error("Failed to send email:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to send email. Please try again.";
      message.error(errorMessage);
    } finally {
      setEmailLoading(false);
    }
  };

  const totalRecipients = manualEmails.length + roleEmailCount;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Email Announcements
      </h1>

      <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/30 p-6 mb-6">
        <div className="text-purple-800">
          <strong className="text-lg">📧 Send Club Announcement</strong>
          <div className="text-sm mt-2 text-gray-600">
            Send email announcements to club members based on their roles or to
            specific email addresses.
          </div>
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/30 p-6">
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          className="max-w-4xl 
                    [&_.ant-form-item-label]:text-gray-700 
                    [&_.ant-form-item-label]:font-medium 
                    
                    /* Input Fields */
                    [&_.ant-form-item-control-input-content]:rounded-xl
                    [&_.ant-form-item-control-input-content]:border-2

                    [&_.ant-input]:bg-white/70 
                    [&_.ant-input]:backdrop-blur-md 
                    [&_.ant-input]:border-white/30 
                    [&_.ant-input]:rounded-xl 
                    [&_.ant-input]:focus:bg-white/90 
                    [&_.ant-input]:focus:border-purple-500/50 
                    [&_.ant-input]:focus:shadow-lg 
                    [&_.ant-input]:focus:shadow-purple-500/20 
                    
                    /* Select Fields */
                    [&_.ant-select-selector]:bg-white/70
                    [&_.ant-select-selector]:backdrop-blur-md 
                    [&_.ant-select-selector]:border-white/30 
                    [&_.ant-select-selector]:rounded-xl 
                    
                    /* Checkbox Fields */
                    [&_.ant-checkbox-wrapper]:bg-white/50 
                    [&_.ant-checkbox-wrapper]:backdrop-blur-md 
                    [&_.ant-checkbox-wrapper]:border-white/30 
                    [&_.ant-checkbox-wrapper]:rounded-lg 
                    [&_.ant-checkbox-wrapper]:p-3 
                    [&_.ant-checkbox-wrapper]:m-1 
                    [&_.ant-checkbox-wrapper:hover]:bg-white/70"
        >
          {/* Recipients Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Recipients</h3>

            {/* Role-based Recipients */}
            <Card size="small" className="mb-4">
              <h4 className="font-medium mb-3">Send to User Roles:</h4>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send to User Roles
                </label>
                <div className="space-y-2">
                  <Checkbox
                    checked={selectedRoles.includes(Role.USER)}
                    onChange={(e) => {
                      const newRoles = e.target.checked
                        ? [...selectedRoles, Role.USER]
                        : selectedRoles.filter((role) => role !== Role.USER);
                      handleRoleChange(newRoles);
                    }}
                  >
                    All Club Members
                  </Checkbox>
                  <Checkbox
                    checked={selectedRoles.includes(Role.MEMBER)}
                    onChange={(e) => {
                      const newRoles = e.target.checked
                        ? [...selectedRoles, Role.MEMBER]
                        : selectedRoles.filter((role) => role !== Role.MEMBER);
                      handleRoleChange(newRoles);
                    }}
                  >
                    All Members <Tag color="orange">Members</Tag>
                  </Checkbox>
                  <Checkbox
                    checked={selectedRoles.includes(Role.ADMIN)}
                    onChange={(e) => {
                      const newRoles = e.target.checked
                        ? [...selectedRoles, Role.ADMIN]
                        : selectedRoles.filter((role) => role !== Role.ADMIN);
                      handleRoleChange(newRoles);
                    }}
                  >
                    All Admins <Tag color="red">Admins</Tag>
                  </Checkbox>
                </div>
              </div>
            </Card>

            {/* Manual Email Input */}
            <Card size="small">
              <h4 className="font-medium mb-3">
                Add Specific Email Addresses:
              </h4>

              {/* Email Search/Add */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Specific Email Addresses
                </label>
                <AutoComplete
                  value={emailSearchValue}
                  options={emailSearchOptions}
                  onSearch={handleEmailSearch}
                  onSelect={handleEmailSelect}
                  placeholder="Search by name (e.g., 'john doe') or email address..."
                  className="w-full"
                  filterOption={(inputValue, option) => {
                    // Don't filter out disabled options, just don't allow selection
                    return (
                      option?.label
                        ?.toLowerCase()
                        .includes(inputValue.toLowerCase()) || false
                    );
                  }}
                >
                  <Input
                    suffix={
                      <Space>
                        {searchLoading && (
                          <LoadingOutlined className="text-gray-400" />
                        )}
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={() => handleAddManualEmail(emailSearchValue)}
                          disabled={
                            !emailSearchValue.trim() ||
                            roleEmails.includes(emailSearchValue)
                          }
                          size="small"
                        />
                      </Space>
                    }
                  />
                </AutoComplete>
                <p className="text-xs text-gray-500 mt-1">
                  💡 Tip: You can search by first name, last name, full name, or
                  email address. NYU emails use initials (e.g., "jd4322@nyu.edu"
                  for John Doe).
                </p>
              </div>

              {/* Manual Email List */}
              {manualEmails.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2">
                    Selected Email Addresses ({manualEmails.length}):
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {manualEmails.map((email, index) => (
                      <Tag
                        key={index}
                        closable
                        onClose={() => handleRemoveManualEmail(email)}
                        color="blue"
                      >
                        {email}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Recipients Summary */}
            {(selectedRoles.length > 0 || manualEmails.length > 0) && (
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
                <div className="text-green-800 text-sm">
                  <strong>Total Recipients: </strong>
                  {selectedRoles.length > 0 && (
                    <span>
                      {roleEmailCount} from selected role
                      {selectedRoles.length > 1 ? "s" : ""} (
                      {selectedRoles.join(", ")})
                    </span>
                  )}
                  {selectedRoles.length > 0 && manualEmails.length > 0 && (
                    <span> + </span>
                  )}
                  {manualEmails.length > 0 && (
                    <span>
                      {manualEmails.length} specific email
                      {manualEmails.length > 1 ? "s" : ""}
                    </span>
                  )}
                  <br />
                  <span className="font-semibold">
                    Estimated Total: {roleEmailCount + manualEmails.length}{" "}
                    recipient
                    {roleEmailCount + manualEmails.length !== 1 ? "s" : ""}
                  </span>
                  {roleEmailCount === 0 && selectedRoles.length > 0 && (
                    <div className="mt-2 text-orange-700 text-xs">
                      💡 No users found with these roles. You can:
                      <ul className="list-disc list-inside mt-1 ml-2">
                        <li>
                          Go to the <strong>Users</strong> page to assign roles
                          to users
                        </li>
                        <li>
                          Use the search above to add specific email addresses
                        </li>
                        <li>Try selecting different roles</li>
                      </ul>
                    </div>
                  )}
                  {roleEmailCount > 0 && (
                    <div className="mt-2 text-blue-700 text-xs">
                      💡 Emails from role selection are automatically included.
                      You can still add specific emails that aren't already
                      included.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Divider />

          {/* Email Content Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Email Content</h3>

            <Form.Item
              name="header"
              label="Email Header"
              rules={[
                { required: true, message: "Please enter email header" },
                { max: 100, message: "Header cannot exceed 100 characters" },
              ]}
            >
              <Input
                placeholder="e.g., Important Club Announcement!"
                className="!bg-white/90 
                        !backdrop-blur-md 
                        !border-white/50 
                        !rounded-xl 
                        focus:!bg-white 
                        focus:!border-purple-500/50 
                        focus:!shadow-lg 
                        focus:!shadow-purple-500/20"
              />
            </Form.Item>

            <Form.Item
              name="subject"
              label="Subject"
              rules={[
                { required: true, message: "Please enter email subject" },
              ]}
            >
              <Input
                placeholder="e.g., Club Meeting This Friday"
                className="!bg-white/90 
                        !backdrop-blur-md 
                        !border-white/50 
                        !rounded-xl 
                        focus:!bg-white
                        focus:!border-purple-500/50 
                        focus:!shadow-lg 
                        focus:!shadow-purple-500/20"
              />
            </Form.Item>

            <Form.Item
              name="body"
              label="Message Body"
              rules={[
                { required: true, message: "Please enter email message" },
              ]}
            >
              <TextArea
                placeholder="Enter your announcement message here..."
                rows={8}
                showCount
                maxLength={2000}
                className="!bg-white/90 
                        !backdrop-blur-md 
                        !border-white/50 
                        !rounded-xl 
                        focus:!bg-white 
                        focus:!border-purple-500/50 
                        focus:!shadow-lg 
                        focus:!shadow-purple-500/20"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={emailLoading}
              disabled={selectedRoles.length === 0 && manualEmails.length === 0}
              icon={<MailOutlined />}
              size="large"
              className="!bg-gradient-to-r !from-purple-500 !to-blue-500 !border-none 
              !rounded-xl !shadow-lg !shadow-purple-500/30 !transition-all 
              !duration-300 hover:!-translate-y-1 hover:!shadow-xl 
              hover:!shadow-purple-500/40 !text-white
               [&_span]:!text-white [&_.anticon]:!text-white"
            >
              Send Email Announcement
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay) as any;
  };
}

export default Email;
