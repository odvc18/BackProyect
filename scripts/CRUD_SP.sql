USE identity_db;
GO

-- CREATE User
CREATE PROCEDURE sp_users_create
    @email NVARCHAR(255),
    @password_hash NVARCHAR(255),
    @role NVARCHAR(50),
    @first_name NVARCHAR(100) = NULL,
    @last_name NVARCHAR(100) = NULL,
    @phone NVARCHAR(20) = NULL,
    @institution NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @new_id UNIQUEIDENTIFIER = NEWID();
    
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, institution)
    VALUES (@new_id, @email, @password_hash, @role, @first_name, @last_name, @phone, @institution);
    
    SELECT * FROM users WHERE id = @new_id;
END
GO

-- READ User by ID
CREATE PROCEDURE sp_users_get_by_id
    @user_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM users WHERE id = @user_id AND is_active = 1;
END
GO

-- READ User by Email
CREATE PROCEDURE sp_users_get_by_email
    @email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM users WHERE email = @email AND is_active = 1;
END
GO

-- UPDATE User
CREATE PROCEDURE sp_users_update
    @user_id UNIQUEIDENTIFIER,
    @first_name NVARCHAR(100) = NULL,
    @last_name NVARCHAR(100) = NULL,
    @phone NVARCHAR(20) = NULL,
    @institution NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE users 
    SET first_name = ISNULL(@first_name, first_name),
        last_name = ISNULL(@last_name, last_name),
        phone = ISNULL(@phone, phone),
        institution = ISNULL(@institution, institution),
        updated_at = GETDATE()
    WHERE id = @user_id;
    
    SELECT * FROM users WHERE id = @user_id;
END
GO

-- DELETE User (Soft Delete)
CREATE PROCEDURE sp_users_delete
    @user_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE users SET is_active = 0, updated_at = GETDATE() WHERE id = @user_id;
END
GO

USE contest_db;
GO

-- CREATE Contest
CREATE PROCEDURE sp_contests_create
    @title NVARCHAR(255),
    @description NVARCHAR(MAX) = NULL,
    @rules NVARCHAR(MAX) = NULL,
    @status NVARCHAR(50),
    @start_date DATETIME2,
    @end_date DATETIME2,
    @judging_date DATETIME2 = NULL,
    @max_submissions_per_participant INT = 1,
    @created_by_user_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @new_id UNIQUEIDENTIFIER = NEWID();
    
    INSERT INTO contests (id, title, description, rules, status, start_date, end_date, 
                         judging_date, max_submissions_per_participant, created_by_user_id)
    VALUES (@new_id, @title, @description, @rules, @status, @start_date, @end_date,
            @judging_date, @max_submissions_per_participant, @created_by_user_id);
    
    SELECT * FROM contests WHERE id = @new_id;
END
GO

-- READ Contest by ID
CREATE PROCEDURE sp_contests_get_by_id
    @contest_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM contests WHERE id = @contest_id;
END
GO

-- READ Active Contests
CREATE PROCEDURE sp_contests_get_active
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM contests 
    WHERE status IN ('Published', 'Closed') 
    ORDER BY start_date DESC;
END
GO

-- UPDATE Contest
CREATE PROCEDURE sp_contests_update
    @contest_id UNIQUEIDENTIFIER,
    @title NVARCHAR(255) = NULL,
    @description NVARCHAR(MAX) = NULL,
    @rules NVARCHAR(MAX) = NULL,
    @status NVARCHAR(50) = NULL,
    @end_date DATETIME2 = NULL,
    @judging_date DATETIME2 = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE contests 
    SET title = ISNULL(@title, title),
        description = ISNULL(@description, description),
        rules = ISNULL(@rules, rules),
        status = ISNULL(@status, status),
        end_date = ISNULL(@end_date, end_date),
        judging_date = ISNULL(@judging_date, judging_date),
        updated_at = GETDATE()
    WHERE id = @contest_id;
    
    SELECT * FROM contests WHERE id = @contest_id;
END
GO

-- CREATE Category
CREATE PROCEDURE sp_categories_create
    @contest_id UNIQUEIDENTIFIER,
    @name NVARCHAR(255),
    @description NVARCHAR(MAX) = NULL,
    @max_submissions INT = NULL,
    @allowed_file_types NVARCHAR(500) = NULL,
    @max_file_size_mb INT = 100
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @new_id UNIQUEIDENTIFIER = NEWID();
    
    INSERT INTO categories (id, contest_id, name, description, max_submissions, allowed_file_types, max_file_size_mb)
    VALUES (@new_id, @contest_id, @name, @description, @max_submissions, @allowed_file_types, @max_file_size_mb);
    
    SELECT * FROM categories WHERE id = @new_id;
END
GO

-- READ Categories by Contest
CREATE PROCEDURE sp_categories_get_by_contest
    @contest_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM categories WHERE contest_id = @contest_id ORDER BY name;
END
GO

USE submission_db;
GO

-- CREATE Submission
CREATE PROCEDURE sp_submissions_create
    @contest_id UNIQUEIDENTIFIER,
    @category_id UNIQUEIDENTIFIER,
    @participant_id UNIQUEIDENTIFIER,
    @title NVARCHAR(500) = NULL,
    @description NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @new_id UNIQUEIDENTIFIER = NEWID();
    
    BEGIN TRY
        INSERT INTO submissions (id, contest_id, category_id, participant_id, title, description, status)
        VALUES (@new_id, @contest_id, @category_id, @participant_id, @title, @description, 'Draft');
        
        SELECT * FROM submissions WHERE id = @new_id;
    END TRY
    BEGIN CATCH
        IF ERROR_NUMBER() = 2627 -- Violation of UNIQUE constraint
            THROW 51000, 'User already has a submission for this contest category', 1;
        ELSE
            THROW;
    END CATCH
END
GO

-- SUBMIT Submission (Change status to Submitted)
CREATE PROCEDURE sp_submissions_submit
    @submission_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE submissions 
    SET status = 'Submitted', 
        submitted_at = GETDATE(),
        updated_at = GETDATE()
    WHERE id = @submission_id;
    
    SELECT * FROM submissions WHERE id = @submission_id;
END
GO

-- READ Submission by ID
CREATE PROCEDURE sp_submissions_get_by_id
    @submission_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM submissions WHERE id = @submission_id;
END
GO

-- READ Submissions by Contest
CREATE PROCEDURE sp_submissions_get_by_contest
    @contest_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM submissions WHERE contest_id = @contest_id ORDER BY submitted_at DESC;
END
GO

-- READ Submissions by Participant
CREATE PROCEDURE sp_submissions_get_by_participant
    @participant_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM submissions WHERE participant_id = @participant_id ORDER BY created_at DESC;
END
GO

-- CREATE Submission File
CREATE PROCEDURE sp_submission_files_create
    @submission_id UNIQUEIDENTIFIER,
    @file_name NVARCHAR(255),
    @original_name NVARCHAR(255),
    @stored_path NVARCHAR(500),
    @file_size BIGINT,
    @mime_type NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @new_id UNIQUEIDENTIFIER = NEWID();
    
    INSERT INTO submission_files (id, submission_id, file_name, original_name, stored_path, file_size, mime_type)
    VALUES (@new_id, @submission_id, @file_name, @original_name, @stored_path, @file_size, @mime_type);
    
    SELECT * FROM submission_files WHERE id = @new_id;
END
GO

-- READ Files by Submission
CREATE PROCEDURE sp_submission_files_get_by_submission
    @submission_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM submission_files WHERE submission_id = @submission_id;
END
GO

USE evaluation_db;
GO

-- CREATE Judge Assignment
CREATE PROCEDURE sp_judge_assignments_create
    @contest_id UNIQUEIDENTIFIER,
    @submission_id UNIQUEIDENTIFIER,
    @judge_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @new_id UNIQUEIDENTIFIER = NEWID();
    
    BEGIN TRY
        INSERT INTO judge_assignments (id, contest_id, submission_id, judge_id, status)
        VALUES (@new_id, @contest_id, @submission_id, @judge_id, 'Assigned');
        
        SELECT * FROM judge_assignments WHERE id = @new_id;
    END TRY
    BEGIN CATCH
        IF ERROR_NUMBER() = 2627
            THROW 51000, 'Judge is already assigned to this submission', 1;
        ELSE
            THROW;
    END CATCH
END
GO

-- READ Assignments by Judge
CREATE PROCEDURE sp_judge_assignments_get_by_judge
    @judge_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM judge_assignments WHERE judge_id = @judge_id ORDER BY assigned_at DESC;
END
GO

-- READ Assignments by Submission
CREATE PROCEDURE sp_judge_assignments_get_by_submission
    @submission_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM judge_assignments WHERE submission_id = @submission_id;
END
GO

-- CREATE Score
CREATE PROCEDURE sp_scores_create
    @judge_assignment_id UNIQUEIDENTIFIER,
    @rubric_criterion_id UNIQUEIDENTIFIER,
    @score DECIMAL(5,2),
    @comments NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @new_id UNIQUEIDENTIFIER = NEWID();
    
    INSERT INTO scores (id, judge_assignment_id, rubric_criterion_id, score, comments)
    VALUES (@new_id, @judge_assignment_id, @rubric_criterion_id, @score, @comments);
    
    -- Update judge assignment status
    UPDATE judge_assignments SET status = 'Completed', completed_at = GETDATE()
    WHERE id = @judge_assignment_id;
    
    SELECT * FROM scores WHERE id = @new_id;
END
GO

-- READ Scores by Assignment
CREATE PROCEDURE sp_scores_get_by_assignment
    @judge_assignment_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM scores WHERE judge_assignment_id = @judge_assignment_id;
END
GO

-- CREATE Rubric
CREATE PROCEDURE sp_rubrics_create
    @contest_id UNIQUEIDENTIFIER,
    @criterion_name NVARCHAR(255),
    @description NVARCHAR(MAX) = NULL,
    @max_score DECIMAL(5,2),
    @weight DECIMAL(5,2) = 1.00,
    @criteria_order INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @new_id UNIQUEIDENTIFIER = NEWID();
    
    INSERT INTO rubrics (id, contest_id, criterion_name, description, max_score, weight, criteria_order)
    VALUES (@new_id, @contest_id, @criterion_name, @description, @max_score, @weight, @criteria_order);
    
    SELECT * FROM rubrics WHERE id = @new_id;
END
GO

-- READ Rubrics by Contest
CREATE PROCEDURE sp_rubrics_get_by_contest
    @contest_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM rubrics WHERE contest_id = @contest_id ORDER BY criteria_order;
END
GO

USE ai_analysis_db;
GO

-- CREATE Analysis Request
CREATE PROCEDURE sp_analysis_requests_create
    @submission_file_id UNIQUEIDENTIFIER,
    @file_path NVARCHAR(500),
    @analysis_type NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @new_id UNIQUEIDENTIFIER = NEWID();
    
    INSERT INTO analysis_requests (id, submission_file_id, file_path, analysis_type, status)
    VALUES (@new_id, @submission_file_id, @file_path, @analysis_type, 'Pending');
    
    SELECT * FROM analysis_requests WHERE id = @new_id;
END
GO

-- UPDATE Analysis Request Status
CREATE PROCEDURE sp_analysis_requests_update_status
    @request_id UNIQUEIDENTIFIER,
    @status NVARCHAR(50),
    @error_message NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE analysis_requests 
    SET status = @status,
        started_at = CASE WHEN @status = 'Processing' THEN GETDATE() ELSE started_at END,
        completed_at = CASE WHEN @status IN ('Completed', 'Failed') THEN GETDATE() ELSE completed_at END,
        error_message = @error_message
    WHERE id = @request_id;
    
    SELECT * FROM analysis_requests WHERE id = @request_id;
END
GO

-- READ Analysis Requests by Status
CREATE PROCEDURE sp_analysis_requests_get_by_status
    @status NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM analysis_requests WHERE status = @status ORDER BY requested_at;
END
GO

-- CREATE Analysis Result
CREATE PROCEDURE sp_analysis_results_create
    @analysis_request_id UNIQUEIDENTIFIER,
    @result_type NVARCHAR(100),
    @result_data NVARCHAR(MAX),
    @confidence_score DECIMAL(5,4) = NULL,
    @metadata NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @new_id UNIQUEIDENTIFIER = NEWID();
    
    INSERT INTO analysis_results (id, analysis_request_id, result_type, result_data, confidence_score, metadata)
    VALUES (@new_id, @analysis_request_id, @result_type, @result_data, @confidence_score, @metadata);
    
    SELECT * FROM analysis_results WHERE id = @new_id;
END
GO

-- READ Analysis Results by Request
CREATE PROCEDURE sp_analysis_results_get_by_request
    @analysis_request_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM analysis_results WHERE analysis_request_id = @analysis_request_id;
END
GO
